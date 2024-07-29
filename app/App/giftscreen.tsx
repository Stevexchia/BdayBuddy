import { View, Text, StyleSheet, Image, FlatList, TextInput, TouchableOpacity, Modal, Dimensions, Linking, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { FIREBASE_DB } from '../../FirebaseConfig'; // Import the Firestore instance
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window'); // Get screen width

const categories = [
  { key: 'crochet', label: 'Crochet 🧶' },
  { key: 'kayaking', label: 'Kayaking 🛶' },
  { key: 'basketball', label: 'Basketball 🏀' },
  { key: 'gardening', label: 'Gardening 🪴' },
  { key: 'guitar', label: 'Guitar 🎸' },
  { key: 'cooking', label: 'Cooking 🧑‍🍳' },
];

const GiftScreen = () => {
  const [gifts, setGifts] = useState([]);
  const [filteredGifts, setFilteredGifts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedGift, setSelectedGift] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [favorites, setFavorites] = useState(new Set()); // State to track favorite items
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    async function fetchGifts() {
      try {
        const giftsCollection = collection(FIREBASE_DB, 'gifts'); // Reference to the 'gifts' collection
        const giftSnapshot = await getDocs(giftsCollection); // Fetch all documents in the collection
        const giftList = giftSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Map the documents to their data
        setGifts(giftList);
        setFilteredGifts(giftList);
      } catch (error) {
        console.error('Error fetching gifts: ', error);
      } finally {
        setLoading(false);
      }
    }

    fetchGifts();
  }, []);

  useEffect(() => {
    let results = gifts;

    if (showFavorites) {
      results = results.filter(gift => favorites.has(gift.id)); // Filter by favorites
    }
  
    if (selectedCategory) {
      results = results.filter(gift =>
        gift.hobbies && gift.hobbies.includes(selectedCategory)
      );
    }
  
    if (searchQuery) {
      results = results.filter(gift =>
        gift.name && gift.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
  
    const collator = new Intl.Collator(undefined, { sensitivity: 'base' });
  
    if (sortOption) {
      results = results.slice().sort((a, b) => {
        if (sortOption === 'name-asc') {
          return collator.compare(a.name || '', b.name || '');
        } else if (sortOption === 'name-desc') {
          return collator.compare(b.name || '', a.name || '');
        } else if (sortOption === 'price-asc') {
          return (a.price || 0) - (b.price || 0);
        } else if (sortOption === 'price-desc') {
          return (b.price || 0) - (a.price || 0);
        }
        return 0;
      });
    }
  
    setFilteredGifts(results);
  }, [searchQuery, gifts, sortOption, selectedCategory, showFavorites, favorites]);

  const handleGiftPress = (gift) => {
    setSelectedGift(gift);
    setDetailModalVisible(true);
  };

  const handleShopeeLink = () => {
    if (selectedGift?.shopee) {
      Linking.openURL(selectedGift.shopee);
    } else {
      console.log('Shopee link not available');
    }
  };

  const toggleFavorite = (id) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => handleGiftPress(item)}>
      <View style={styles.favoriteButtonContainer}>
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => toggleFavorite(item.id)}
        >
          <Ionicons
            name={favorites.has(item.id) ? 'star' : 'star-outline'}
            size={24}
            color={favorites.has(item.id) ? '#FFD700' : '#ccc'}
          />
        </TouchableOpacity>
      </View>
      <Image source={{ uri: item.imageurl || 'https://via.placeholder.com/150' }} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.price}>${item.price}</Text>
    </TouchableOpacity>
  );

  const handleCategoryPress = (category) => {
    setSelectedCategory(category.key);
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const applyFilter = (selectedHobbies) => {
    const results = gifts.filter(gift =>
      selectedHobbies.every(hobby => gift.hobbies && gift.hobbies.includes(hobby))
    );
    setFilteredGifts(results);
    toggleModal();
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSortOption(null);
    setSelectedCategory(null);
    setFilteredGifts(gifts);
    toggleModal();
  };

  const closeDetailModal = () => {
    setDetailModalVisible(false);
    setSelectedGift(null);
  };

  const modalOptions = [
    { key: 'name-asc', label: 'Sort by Name (A to Z)' },
    { key: 'name-desc', label: 'Sort by Name (Z to A)' },
    { key: 'price-asc', label: 'Sort by Price (Low to High)' },
    { key: 'price-desc', label: 'Sort by Price (High to Low)' }
  ];

  const toggleShowFavorites = () => {
    setShowFavorites(prev => !prev);
  };  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>GIFTS</Text>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#294865" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search Gifts"
          placeholderTextColor="black"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.filterButton} onPress={toggleModal}>
          <Text style={styles.filterButtonText}>Filter</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.categoryContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[styles.categoryButton, !selectedCategory && styles.selectedCategory]}
            onPress={() => handleCategoryPress({ key: null })}
          >
            <Text style={[styles.categoryText, !selectedCategory && styles.selectedCategoryText]}>All</Text>
          </TouchableOpacity>
          {categories.map(category => (
            <TouchableOpacity
              key={category.key}
              style={[styles.categoryButton, selectedCategory === category.key && styles.selectedCategory]}
              onPress={() => handleCategoryPress(category)}
            >
              <Text style={[styles.categoryText, selectedCategory === category.key && styles.selectedCategoryText]}>
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <Text>Loading...</Text>
      ) : filteredGifts.length > 0 ? (
        <FlatList
          data={filteredGifts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.list}
        />
      ) : (
        <Text>No gifts available</Text>
      )}

         {/* Button to toggle favorites */}
    <TouchableOpacity style={styles.toggleFavoritesButton} onPress={toggleShowFavorites}>
      <Text style={styles.toggleFavoritesButtonText}>
        {showFavorites ? 'Show All Items' : 'Show Favorites Only'}
      </Text>
    </TouchableOpacity>

      {/* Modal for Filters */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter Options</Text>
            {modalOptions.map(option => (
              <TouchableOpacity
                key={option.key}
                onPress={() => setSortOption(option.key)}
                style={styles.modalOptionContainer}
              >
                <Text style={[styles.modalOption, sortOption === option.key && styles.selectedOption]}>
                  {sortOption === option.key && '✓ '}
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={clearFilters}>
              <Text style={styles.clearFiltersOption}>Clear All Filters</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Detail Modal */}
      {selectedGift && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={detailModalVisible}
          onRequestClose={closeDetailModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Image source={{ uri: selectedGift.imageurl || 'https://via.placeholder.com/150' }} style={styles.modalImage} />
              <Text style={styles.modalName}>{selectedGift.name}</Text>
              <Text style={styles.modalPrice}>${selectedGift.price}</Text>
              {selectedGift.description && <Text style={styles.modalDescription}>{selectedGift.description}</Text>}
              {selectedGift.shopee && (
                  <TouchableOpacity onPress={handleShopeeLink} style={styles.shopeeButton}>
                    <Image
                      source={require('../../assets/images/shopee_logo.png')} // Import the Shopee logo image
                      style={styles.shopeeLogo}
                    />
                    <Text style={styles.shopeeButtonText}>Buy on Shopee</Text>
                  </TouchableOpacity>
                )}
              <TouchableOpacity onPress={closeDetailModal} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#294865',
    textAlign: 'center',
    marginVertical: 10,
    marginTop: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 15,
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  filterButton: {
    marginLeft: 10,
    backgroundColor: '#294865',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  filterButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  categoryContainer: {
    marginBottom: 10,
  },
  categoryButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
  },
  selectedCategory: {
    backgroundColor: '#294865',
  },
  categoryText: {
    color: '#294865',
    fontSize: 16,
  },
  selectedCategoryText: {
    color: '#fff',
  },
  list: {
    paddingHorizontal: 10,
  },
  itemContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 5,
    padding: 10,
    width: (width / 2) - 20, // Adjust width for two columns
    position: 'relative', // Add relative positioning
  },
  favoriteButtonContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1, // Ensure it appears above other elements
  },
  toggleFavoritesButton: {
    backgroundColor: '#294865',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    margin: 20,
    alignItems: 'center',
  },
  toggleFavoritesButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  favoriteButton: {
    backgroundColor: '#fff', // Background color to make sure the button is visible
    borderRadius: 20,
    padding: 5,
  },
  image: {
    width: '100%',
    height: 100,
    borderRadius: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  price: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginTop: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxHeight: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalOptionContainer: {
    marginVertical: 5,
  },
  modalOption: {
    fontSize: 16,
    padding: 10,
  },
  selectedOption: {
    color: '#294865',
    fontWeight: 'bold',
  },
  clearFiltersOption: {
    fontSize: 16,
    color: 'red',
    marginVertical: 10,
  },
  shopeeLogo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#294865',
    borderRadius: 20,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  modalName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalPrice: {
    fontSize: 16,
    color: '#888',
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  shopeeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF5722',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 10,
  },
  shopeeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default GiftScreen;
