import React, { children } from 'react';

// Keyboard Avoiding View
import { KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback, Keyboard} from 'react-native';

const KeyboardAvoidingWrapper = () => {
    return (
        <KeyboardAvoidingView style={{flex: 1}}>
            <ScrollView>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    {children}
                </TouchableWithoutFeedback>
            </ScrollView>
            </KeyboardAvoidingView>
    );
}

export default KeyboardAvoidingWrapper;