/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
} from 'react-native';
import { Button } from 'react-native-elements';
import AnswerChoices from './components/answerChoices'
import Icon from 'react-native-vector-icons/FontAwesome';

import {
    Header,
    LearnMoreLinks,
    Colors,
    DebugInstructions,
    ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

var Sound = require('react-native-sound');

export default class App extends Component {
    constructor(props){
        super(props);
        Sound.setCategory('Playback');
        this.state={
            level: 0,
            intervals: ['Minor 2nd','Major 2nd','Minor 3rd','Major 3rd','Perfect 4th','Tritone','Perfect 5th','Minor 6th','Major 6th','Minor 7','Major','Octave','Minor 9th','Major 9th'],
            choices: [
                ['Major 3rd', 'Perfect 5th', 'Octave'],
                ['Minor 2nd', 'Major 3rd', 'P5', 'Octave'],
                ['Minor 2nd', 'Minor 3rd', 'Major 3rd', 'Perfect 5th', 'Octave'],
                ['Minor 2nd', 'Major 2nd', 'Minor 3rd', 'Major 3rd', 'Perfect 5th', 'Octave'],
                ['Minor 2nd', 'Major 2nd', 'Minor 3rd', 'Major 3rd', 'Perfect 4th', 'Perfect 5th', 'Octave'],
            ]
        }
    }

    playNextSound(){
        let whoosh = new Sound('pianoNotes/Piano.mf.C5.aiff', Sound.MAIN_BUNDLE, (error) => {
            if (error) {
                console.log('failed to load the sound', error);
                return;
            }
            // loaded successfully
            console.log('duration in seconds: ' + whoosh.getDuration() + 'number of channels: ' + whoosh.getNumberOfChannels());
            // Play the sound with an onEnd callback
            whoosh.play();
            setTimeout(() => {
                whoosh.release();
            }, 1500)
        });
    }

    playSounds(){
        let whoosh = new Sound('pianoNotes/Piano.mf.C4.aiff', Sound.MAIN_BUNDLE, (error) => {
            if (error) {
                console.log('failed to load the sound', error);
                return;
            }
            // loaded successfully
            console.log('duration in seconds: ' + whoosh.getDuration() + 'number of channels: ' + whoosh.getNumberOfChannels());
            // Play the sound with an onEnd callback
            whoosh.play();
            setTimeout(() => {
                whoosh.stop(()=>{
                    this.playNextSound();
                });
            }, 1500)
        });
    }
    render() {
        return (

            <SafeAreaView>
                <ScrollView
                    contentInsetAdjustmentBehavior="automatic"
                    style={styles.scrollView}>

                    <View style={styles.body}>
                        <View style={styles.sectionContainer}>
                            <Text style={styles.sectionTitle}>Interval Training</Text>
                            <Button
                                title='Hear Question'
                                type="outline"
                                onPress={() => {
                                    this.playSounds();
                                }}
                            />
                            <AnswerChoices
                                choices={this.state.choices[this.state.level]}

                            />
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
};

const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: Colors.lighter,
    },
    engine: {
        position: 'absolute',
        right: 0,
    },
    body: {
        backgroundColor: Colors.white,
    },
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: Colors.black,
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
        color: Colors.dark,
    },
    highlight: {
        fontWeight: '700',
    },
    footer: {
        color: Colors.dark,
        fontSize: 12,
        fontWeight: '600',
        padding: 4,
        paddingRight: 12,
        textAlign: 'right',
    },
});

