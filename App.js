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
    Dimensions
} from 'react-native';
import { Button } from 'react-native-elements';
import AnswerChoices from './components/answerChoices';

import Icon from 'react-native-vector-icons/FontAwesome';
import { getRandomInt } from './utilities'

import {
    Header,
    LearnMoreLinks,
    Colors,
    DebugInstructions,
    ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import * as Progress from 'react-native-progress';

var Sound = require('react-native-sound');

export default class App extends Component {
    constructor(props){
        super(props);
        Sound.setCategory('Playback');
        this.state={
            level: 0,
            intervals: ['Minor 2nd','Major 2nd','Minor 3rd','Major 3rd','Perfect 4th','Tritone','Perfect 5th','Minor 6th','Major 6th','Minor 7th','Major 7th','Octave','Minor 9th','Major 9th'],
            choices: [
                ['Major 3rd', 'Perfect 5th', 'Octave'],
                ['Minor 2nd', 'Major 3rd', 'P5', 'Octave'],
                ['Minor 2nd', 'Minor 3rd', 'Major 3rd', 'Perfect 5th', 'Octave'],
                ['Minor 2nd', 'Major 2nd', 'Minor 3rd', 'Major 3rd', 'Perfect 5th', 'Octave'],
                ['Minor 2nd', 'Major 2nd', 'Minor 3rd', 'Major 3rd', 'Perfect 4th', 'Perfect 5th', 'Octave'],
                ['Minor 2nd', 'Major 2nd', 'Minor 3rd', 'Major 3rd', 'Perfect 4th', 'Tritone', 'Perfect 5th', 'Octave'],
                ['Minor 2nd', 'Major 2nd', 'Minor 3rd', 'Major 3rd', 'Perfect 4th', 'Tritone', 'Perfect 5th', 'Minor 6th', 'Octave'],
                ['Minor 2nd', 'Major 2nd', 'Minor 3rd', 'Major 3rd', 'Perfect 4th', 'Tritone', 'Perfect 5th', 'Minor 6th', 'Major 7th', 'Octave'],
                ['Minor 2nd', 'Major 2nd', 'Minor 3rd', 'Major 3rd', 'Perfect 4th', 'Tritone', 'Perfect 5th', 'Minor 6th', 'Major 6th', 'Major 7th', 'Octave'],
                ['Minor 2nd', 'Major 2nd', 'Minor 3rd', 'Major 3rd', 'Perfect 4th', 'Tritone', 'Perfect 5th', 'Minor 6th', 'Major 6th', 'Minor 7th', 'Major 7th', 'Octave'],
                ['Minor 2nd', 'Major 2nd', 'Minor 3rd', 'Major 3rd', 'Perfect 4th', 'Tritone', 'Perfect 5th', 'Minor 6th', 'Major 6th', 'Minor 7th', 'Major 7th', 'Octave','Minor 9th'],
                ['Minor 2nd', 'Major 2nd', 'Minor 3rd', 'Major 3rd', 'Perfect 4th', 'Tritone', 'Perfect 5th', 'Minor 6th', 'Major 6th', 'Minor 7th', 'Major 7th', 'Octave','Minor 9th', 'Major 9th'],
            ],
            pitches: ['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B'],
            tally: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            grade:0,
            attempts:[0,0,0]
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot){
        if (this.state.grade >= .9){
            let length = props.choices.length;
            let attempts = [];

            for (let i = 0; i < length; i++){
                attempts.push(0);
            }

            this.setState({
                level: this.state.level+1,
                tally: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                grade: 0,
                attempts: attempts,
            });
        }
    }


    playNextSound(pitch){

        let whoosh = new Sound('pianoNotes/Piano.mf.'+pitch+'.aiff', Sound.MAIN_BUNDLE, (error) => {
            if (error) {
                console.log('failed to load the sound', error);
                return;
            }
            // loaded successfully
            // Play the sound with an onEnd callback
            whoosh.setCurrentTime(1);
            whoosh.play();
            setTimeout(() => {
                whoosh.release();
            }, 1000)
        });
    }

    playSounds(){
        let index = getRandomInt(this.state.pitches.length)
        let pitchA = this.state.pitches[index];
        let pitchB='';
        let octaveA = getRandomInt(3) + 2;
        let octaveB = octaveA;
        let length = this.state.choices[this.state.level].length;
        let interval = this.state.choices[this.state.level][getRandomInt(length)];
        this.setState({answer: interval});
        console.log('ln 77 interval: '+interval);
        interval = this.state.intervals.indexOf(interval)+1; //changes interval value to semitones

        if (index+interval>11){
            octaveB+=1;
        }
        pitchA=pitchA+octaveA;
        pitchB = this.state.pitches[(index+interval)%12]+octaveB;
        console.log('pitch A: ' + pitchA)
        console.log('pitch b: ' + pitchB)

        let whoosh = new Sound('pianoNotes/Piano.mf.'+pitchA+'.aiff', Sound.MAIN_BUNDLE, (error) => {
            if (error) {
                console.log('failed to load the sound', error);
                return;
            }
            // loaded successfully
            // Play the sound with an onEnd callback
            whoosh.setCurrentTime(1);
            whoosh.play();
            setTimeout(() => {
                whoosh.stop(()=>{
                    this.playNextSound(pitchB);
                });
            }, 1000)
        });
    }

    handleAnswer(response){
        let isCorrect = this.isCorrect(response);
        let attempts = this.state.attempts;
        if (!isCorrect) {
           //get index of response in choices
            //changes that index to 1 in attempts
            let index = this.state.choices[this.state.level].indexOf(response);
            attempts[index] = 1;
        }
        else if (isCorrect){
            for (let i = 0; i < attempts.length; i++){
                attempts[i]=0;
            }
        }

        let tally = [isCorrect].concat(this.state.tally.slice(0,-1));
        let grade = this.averageTally(tally);
        console.log(tally);
        console.log(grade);
        this.setState({
            attempts: attempts,
            tally: tally,
            grade: grade,
        });
    }

    isCorrect(response){

        if (response === this.state.answer)
            return 1;
        return 0;
    }

    averageTally(tally){
        let result=0;
        for (let i = 0; i < tally.length; i++){
            result+=tally[i];
        }
        return result/tally.length;
    }

    render() {
        return (
            <View style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'space-between',
            }}>
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
                                    handleAnswer={(response)=>this.handleAnswer(response)}
                                    choices={this.state.choices[this.state.level]}
                                    level={this.state.level}
                                    attempts={this.state.attempts}
                                />
                            </View>
                        </View>
                    </ScrollView>
                </SafeAreaView>
                <View
                style={{
                    paddingBottom:50,
                    alignSelf:'center'}}>
                    <Progress.Bar progress={this.state.grade} width={Dimensions.get('window').width-50} />
                </View>
            </View>
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

