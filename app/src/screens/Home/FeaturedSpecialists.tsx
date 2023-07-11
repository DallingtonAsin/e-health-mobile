import React, {useContext, useEffect, useState} from 'react';
import {View, Text, Dimensions, Animated, TouchableOpacity, Image} from 'react-native';
import * as configs from "../../configs";
import {Button} from "react-native-paper";

import {AppStyle} from "../../../assets/styles/Styles";
import {DoctorsDetail} from "../../interfaces";
import Icon from 'react-native-vector-icons/FontAwesome'
import {displayMessage} from "../../components/common/SharedHelper";
import {colors} from "../../configs";
import {Context as DoctorContext} from "../../context/doctorContext";
const {width} = Dimensions.get('screen');
const cardWidth = width / 1.8;
const FeaturedSpecialists = ({ navigation }: { navigation: any }) => {
    const scrollX = React.useRef(new Animated.Value(0)).current;
    const [activeCardIndex, setActiveCardIndex] = React.useState(0);
    const [medicalDoctors, setMedicalDoctors] = useState<DoctorsDetail[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const { getMedicalDoctors } = useContext(DoctorContext)

    useEffect(() => {
        getMedicalDoctors({ onSuccess: populateMedicalDoctors, onFailure: displayMessage, onCompletion: stopLoading })
    }, [])


    const populateMedicalDoctors = (doctors: DoctorsDetail[]) => {
        setMedicalDoctors(doctors)
    }

    const stopLoading = () => {
        setIsLoading(false)
    }
    const bookMedicalDoctor = (item: DoctorsDetail) => {
        navigation.navigate('DoctorProfile', { doctor_id: item.id })
    }
    const Card = ({data, index}: {data: any, index: number}) => {
        const inputRange = [
            (index - 1) * cardWidth,
            index * cardWidth,
            (index + 1) * cardWidth,
        ];
        const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.7, 0, 0.7],
        });
        const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.8, 1, 0.8],
        });
        return (
            <TouchableOpacity
                disabled={activeCardIndex != index}
                activeOpacity={1}
                onPress={() => bookMedicalDoctor(data)}>
                <Animated.View style={{...AppStyle.card, transform: [{scale}]}}>
                    <Animated.View style={{...AppStyle.cardOverLay, opacity}} />
                    <View style={AppStyle.priceTag}>
                        <Icon name="heart" size={24} color={data.is_favourite ? configs.colors.orange : configs.colors.silver} />
                    </View>
                    <Image
                        source={
                            data.profile_picture
                                ? {uri: data.profile_picture}
                                : configs.images.doctor
                        }
                        style={AppStyle.cardImage}
                    />
                    <View style={AppStyle.cardDetails}>
                        <View
                            style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <View>
                                <Text style={{fontWeight: 'bold', fontSize: 17,color: colors.gray}}>
                                    {`Dr.`} {data.first_name} {data.last_name}
                                </Text>
                                <Text style={{ fontSize: 15,color: colors.gray}}>
                                    {data.specialty}
                                </Text>
                                <Text
                                    style={{color: configs.colors.gray, fontSize: 12}}
                                    numberOfLines={2}>
                                    {data.bio_summary}
                                </Text>
                            </View>

                            <Icon name="heart" size={24} color={data.is_favourite ? configs.colors.orange : configs.colors.silver} />
                        </View>
                        <Button mode="contained" onPress={() => console.log('Pressed')} style={{marginTop: 10, backgroundColor: configs.colors.danger}}>
                            Consult
                        </Button>
                    </View>
                </Animated.View>
            </TouchableOpacity>
        );
    };
    return (
        <View>
            <Animated.FlatList
                onMomentumScrollEnd={e => {
                    setActiveCardIndex(
                        Math.round(e.nativeEvent.contentOffset.x / cardWidth),
                    );
                }}
                onScroll={Animated.event(
                    [{nativeEvent: {contentOffset: {x: scrollX}}}],
                    {useNativeDriver: true},
                )}
                horizontal
                data={medicalDoctors}
                contentContainerStyle={{
                    paddingVertical: 10,
                    paddingLeft: 20,
                    paddingRight: cardWidth / 2 - 40,
                }}
                showsHorizontalScrollIndicator={false}
                renderItem={({item, index}) => <Card data={item} index={index} />}
                snapToInterval={cardWidth}
            />
        </View>
    );
};

export default FeaturedSpecialists;
