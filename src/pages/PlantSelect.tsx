import React, { useEffect, useState } from 'react';
import  { View, StyleSheet, Text, FlatList, ActivityIndicator } from 'react-native'
import colors from '../styles/colors';
import {Header} from '../components/Header'
import fonts from '../styles/fonts';
import EnvironmentButton from '../components/EnvironmentButton'
import api from '../services/api';
import PlantCardPrimary from '../components/PlantCardPrimary';
import {Load} from '../components/Load'

interface EnvironmentProps {
    key: string,
    title: string
}

interface PlantProps {
    id:string,
    name:string,
    about:string,
    water_tips:string,
    photo:string,
    environments: [string],
    frequency:{
      times:string,
      repeat_every:string,
    }
}

export function PlantSelect() {
    const [environment, setEnvironent] =  useState<EnvironmentProps[]>([]);
    const [plants, setPlants] =  useState<PlantProps[]>([]);
    const [filteredplants, setFilteredPlants] =  useState<PlantProps[]>([]);
    const [environmentSelected, setEnvironentSelected] =  useState('all');
    const [loading, setLoading] = useState<boolean>(true);
    const [page, setPage] = useState(1);
    const [loadMore, setLoadMore] = useState(false);
    const [loadedAll, setLoadedAll] = useState(true);

    async function fetchPlants() {
        const { data } = await api.get(`plants?_sort=name&_order=asc&_page=${page}&_limit=8`)
        if(!data)
            return setLoading(true);
        if(page > 1){
            setPlants(oldValue => [ ...oldValue, ...data])
            setFilteredPlants(oldValue => [ ...oldValue, ...data])

        }
        else{
        setPlants(data);
        setFilteredPlants(data);
        }
        setLoading(false);
        setLoadMore(false);
    }
    function handleEnvironmentSelected(environment: string){
        setEnvironentSelected(environment);

        if(environment === 'all')
            return setFilteredPlants(plants)
        const filtered = plants.filter(plant => 
            plant.environments.includes(environment))
            setFilteredPlants(filtered)
    }

    function handleFetchMore( distance: number){
        if(distance < 1)
            return;
        setLoadMore(true);
        setPage(oldValue => oldValue + 1);
        fetchPlants();
    }

    useEffect(()=>{
        async function fetchEnvironment() {
            const { data } = await api.get('plants_environments?_sort=title&_order=asc')
            setEnvironent([{
                key: 'all',
                title: 'Todos'
            }, ...data])
        }

        fetchEnvironment();

    },[])

    useEffect(()=>{

        fetchPlants();

    },[])

    if(loading)
        return <Load/>
    return (
        <View style={styles.container}>
            <Header/>
            <View style={styles.header}>
            <Text style={styles.title}>Em qual ambiente</Text>
            <Text style={styles.subTitle}>você quer colocar sua planta</Text>
            </View>
            <View>
                <FlatList
                data={environment}
                renderItem={( {item})=>(

                    <EnvironmentButton
                    title={item.title}
                    active={item.key === environmentSelected}
                    onPress={()=> handleEnvironmentSelected(item.key)}
                    />
                )}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.environmentList}
                >

                </FlatList>
            </View>

            <View style={styles.plants}>
                <FlatList
                data={filteredplants}
                renderItem={( {item})=>(

                    <PlantCardPrimary
                     data={item}
                    />
                )}
                showsVerticalScrollIndicator={false}
                numColumns={2}
                onEndReachedThreshold={0.1}
                onEndReached={ ( { distanceFromEnd})=> {
                    handleFetchMore(distanceFromEnd)
                }}
                ListFooterComponent = {
                    loadMore?
                    <ActivityIndicator color={colors.green}/>
                    :
                    <></>
                }
                >

                </FlatList>
            </View>
            
        </View>
    )
    
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
 
    },
    header: {
        paddingHorizontal: 30,
    },

    title:{
        fontSize: 17,
        color: colors.heading,
        fontFamily: fonts.heading,
        lineHeight: 20,
        marginTop: 15,

    },
    subTitle:{
        fontFamily: fonts.text,
        fontSize: 17,
        lineHeight: 20,
        color: colors.heading

    },
    environmentList: {
        height: 40,
        justifyContent: 'center',
        paddingBottom: 5,
        paddingLeft: 32,
        marginVertical: 32,
    },
    plants: {
        flex: 1,
        paddingHorizontal: 32,
        justifyContent: 'center'
    },

})