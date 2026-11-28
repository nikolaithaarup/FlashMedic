import {StatusBar} from 'expo-status-bar';
import React,{useState} from 'react';
import {StyleSheet,Text,View} from 'react-native';
import {ColorTokens,Spacing,Typography} from '../../../constants/theme';
import {Accordion,Chip,NavigationCard,PrimaryButton,Screen,ToolPageHeader} from '../../ui/primitives';
import {drugTopicGroups,shortTopicNames} from './drugCalcMenu';
import type {DrugCalcTopic} from './drugCalcContent';
type Props={headingFont:number;subtitleFont:number;buttonFont:number;onBackHome:()=>void;onStartPractice:(topicIds:string[])=>void;onOpenTheory?:()=>void};
export default function DrugCalcHomeScreen({onBackHome,onStartPractice,onOpenTheory}:Props){
 const [expanded,setExpanded]=useState(false);
 const [selected,setSelected]=useState<DrugCalcTopic[]>([]);
 const toggle=(id:DrugCalcTopic)=>setSelected(old=>old.includes(id)?old.filter(x=>x!==id):[...old,id]);
 return <Screen contentContainerStyle={styles.content} testID="drug-calc-home-screen">
 <StatusBar style="light"/>
 <ToolPageHeader backLabel="Tilbage til forsiden" onBack={onBackHome} title="Lægemiddelregning"/>
 <PrimaryButton label="Start blandet træning" onPress={()=>onStartPractice([])}/>
 <Text style={styles.heading}>Træn efter emne</Text>
 <View style={styles.groups}>{drugTopicGroups.map(group=><NavigationCard key={group.id} title={group.title} description={group.description} onPress={()=>onStartPractice(group.topics)} style={styles.group} testID={'drug-topic-'+group.id}/>)}</View>
 <Accordion title="Vælg selv emner" subtitle={selected.length?selected.length+' valgt':'13 emner'} expanded={expanded} onToggle={()=>setExpanded(v=>!v)}>
 <View style={styles.picker}>{drugTopicGroups.map(group=><View key={group.id} style={styles.pickGroup}><Text style={styles.groupLabel}>{group.title}</Text><View style={styles.chips}>{group.topics.map(topic=><Chip key={topic} label={shortTopicNames[topic]} selected={selected.includes(topic)} onPress={()=>toggle(topic)}/>)}</View></View>)}
 <PrimaryButton disabled={!selected.length} label={'Start valgte emner'+(selected.length?' ('+selected.length+')':'')} onPress={()=>onStartPractice(selected)}/></View>
 </Accordion>
 {onOpenTheory&&<NavigationCard title="Formler og eksempler" description="Slå en metode op" secondary onPress={onOpenTheory}/>}
 </Screen>;
}
const styles=StyleSheet.create({content:{paddingBottom:Spacing.xl,gap:Spacing.sm},heading:{color:ColorTokens.accent.focus,fontSize:Typography.sizes.label,fontWeight:'700',marginTop:Spacing.xs},groups:{flexDirection:'row',flexWrap:'wrap',gap:Spacing.sm},group:{flexBasis:280,flexGrow:1,minWidth:0,width:'auto'},picker:{gap:Spacing.sm},pickGroup:{gap:Spacing.xs},groupLabel:{color:ColorTokens.text.secondary,fontSize:Typography.sizes.label,fontWeight:'600'},chips:{flexDirection:'row',flexWrap:'wrap',gap:Spacing.xs}});
