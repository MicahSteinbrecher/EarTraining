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
    Dimensions,
    Alert,
} from 'react-native';
import { Button } from 'react-native-elements';
import AnswerChoices from './components/answerChoices';

import Icon from 'react-native-vector-icons/FontAwesome';
import { getRandomInt, storageFormat } from './utilities'

import {
    Header,
    LearnMoreLinks,
    Colors,
    DebugInstructions,
    ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import * as Progress from 'react-native-progress';

import AsyncStorage from '@react-native-community/async-storage';

var Sound = require('react-native-sound');

import Voice from 'react-native-voice';

export default class App extends Component {
    constructor(props){
        super(props);
        Sound.setCategory('Playback');
        this.state={
            level: 0,
            intervals: ['Minor 2nd','Major 2nd','Minor 3rd','Major 3rd','Perfect 4th','Tritone','Perfect 5th','Minor 6th','Major 6th','Minor 7th','Major 7th','Octave','Minor 9th','Major 9th'],
            choices: [
                ['Major 3rd', 'Perfect 5th', 'Octave'],
                ['Minor 2nd', 'Major 3rd', 'Perfect 5th', 'Octave'],
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
            attempts:[0,0,0],
            question: null,
        }
    }

    async componentDidMount() {
        try {
            let level = await AsyncStorage.getItem('level');

            if (level !== null) {

                level = parseInt(level);

                let tally = await AsyncStorage.getItem('tally');
                tally = tally.split(',');
                for (let i = 0; i < tally.length; i++) {
                    tally[i] = parseInt(tally[i]);
                }

                let grade = await AsyncStorage.getItem('grade');
                grade = parseFloat(grade);

                let attempts = await AsyncStorage.getItem('attempts');
                attempts = attempts.split(',')
                for (let i = 0; i < attempts.length; i++) {
                    attempts[i] = parseInt(attempts[i]);
                }

                console.log('retrieve saved state: ');
                console.log('level: '+level)
                console.log('tally: '+tally)
                console.log('grade: '+grade)
                console.log('attempts: '+attempts)

                this.setState({
                    level: level,
                    tally: tally,
                    grade: grade,
                    attempts: attempts,
                })

            }
        } catch (e) {
            // error reading value
        }
    }


    componentDidUpdate(prevProps, prevState, snapshot){

        let level = this.state.level+1;
        //program doesn't handle intervals that exceed an octave
        if (this.state.grade >= .9 && level !== 9){
            let length = this.state.choices[level].length;
            let attempts = [];

            for (let i = 0; i < length; i++){
                attempts[i]=0;
            }

            this.setState({
                level: level,
                tally: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                grade: 0,
                attempts: attempts,
            });
        }
    }

    setQuestion() {

        let index = getRandomInt(this.state.pitches.length);
        let pitchA = this.state.pitches[index];
        let pitchB ='';
        let octaveA = getRandomInt(3) + 2;
        let octaveB = octaveA;
        let intervalIndex = getRandomInt(this.state.choices[this.state.level].length);
        let answer = this.state.choices[this.state.level][intervalIndex];
        let interval = this.state.intervals.indexOf(answer)+1; //gets interval in semitones

        console.log('ln 77 interval: '+answer);

        if (index+interval > 11){
            octaveB += 1;
        }
        pitchA=pitchA+octaveA;
        pitchB = this.state.pitches[(index+interval)%12] + octaveB;
        console.log('pitch A: ' + pitchA)
        console.log('pitch B: ' + pitchB)

        this.setState({
            question:{
                pitchA: pitchA,
                pitchB: pitchB,
                answer: answer
            }
        });

        return {
            pitchA: pitchA,
            pitchB: pitchB,
            answer: answer
        }
    }

    askQuestion(){
        if (!this.state.question){
            let question = this.setQuestion();
            this.playSounds(question.pitchA, question.pitchB);
            return;
        }
        let question = this.state.question;
        this.playSounds(question.pitchA, question.pitchB);
    }

    playNextSound(B){

        let whoosh = new Sound('pianoNotes/Piano.mf.'+B+'.aiff', Sound.MAIN_BUNDLE, (error) => {
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

    playSounds(A,B){

        let whoosh = new Sound('pianoNotes/Piano.mf.'+A+'.aiff', Sound.MAIN_BUNDLE, (error) => {
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
                    this.playNextSound(B);
                });
            }, 1000)
        });
    }

    hasAttempted(attempts){
        for (let i = 0; i < attempts.length; i++){
            if (this.state.attempts[i] === 1){
                return true;
            }
        }
        return false;
    }

    handleAnswer(response){
        if (!this.state.question){
            return
        }
        let isCorrect = this.isCorrect(response);
        let attempts = this.state.attempts;
        let tally = this.state.tally;
        let grade = this.state.grade;

        if (!this.hasAttempted(attempts)) {
            tally = [isCorrect].concat(this.state.tally.slice(0, -1));
            grade = this.averageTally(tally);
        }

        if (!isCorrect) {
            let index = this.state.choices[this.state.level].indexOf(response);
            attempts[index] = 1;
        }
        else if (isCorrect){
            for (let i = 0; i < attempts.length; i++){
                attempts[i]=0;
            }
            this.setQuestion();
        }

        console.log(tally);
        console.log(grade);
        this.setState({
            attempts: attempts,
            tally: tally,
            grade: grade,
        });


    }

    isCorrect(response){

        if (response === this.state.question.answer)
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

    handleRestart(){
        console.log('restart fired');
        Alert.alert(
            'Confirm restart',
            '',
            [
                {
                    text: 'Confirm',
                    onPress: async () => {
                        console.log('restart confirmed');
                        await this.reset()
                    }
                },
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
            ],
        );
    }

    async reset() {
        try {
            await AsyncStorage.clear();
        } catch (e) {
            // clear error
        }

        this.setState({
            level: 0,
            tally: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            grade: 0,
            attempts: [0, 0, 0],
            question: null,
        })
    }

    async handleSave(){

        Alert.alert('Saved State');

        try {
            await AsyncStorage.setItem('level', this.state.level.toString());
            await AsyncStorage.setItem('tally', this.state.tally.toString());
            await AsyncStorage.setItem('grade', this.state.grade.toString());
            await AsyncStorage.setItem('attempts', this.state.attempts.toString());
        } catch (e) {
            console.log(e);
        }
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
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                }}>
                                    <Text style={styles.sectionTitle}>Interval Training</Text>
                                    <Button
                                        title='restart'
                                        onPress={()=>this.handleRestart()}
                                    />
                                    <Button
                                        title='save'
                                        onPress={async () => await this.handleSave()}
                                    />
                                </View>
                                <Button
                                    style={{paddingTop: 20}}
                                    title='Hear Question'
                                    type="outline"
                                    onPress={() => {
                                        this.askQuestion();
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
                    <Progress.Bar progress={this.state.grade/.9} width={Dimensions.get('window').width-50} />
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

