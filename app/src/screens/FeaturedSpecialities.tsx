import React, {useContext, useEffect, useState} from 'react';
import {
    View,
    Text,
    Dimensions,
    Image,
    FlatList
} from 'react-native';


import {AppStyle} from "../../assets/styles/Styles";
import {DoctorsDetail, MedicalSpecialty} from "../interfaces";
import Icon from 'react-native-vector-icons/FontAwesome'
import {displayMessage} from "../components/common/SharedHelper";
import {colors} from "../configs";
import {Context as AppContext} from "../context/appContext";
import * as configs from "../configs";
const {width} = Dimensions.get('screen');
const FeaturedSpecialities = ({ navigation }: { navigation: any }) => {
    const [medicalSpecialties, setMedicalSpecialties] = useState<MedicalSpecialty[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const { getMedicalSpecialties } = useContext(AppContext)

    useEffect(() => {
        getMedicalSpecialties({ onSuccess: populateSpecialities, onFailure: displayMessage, onCompletion: stopLoading })
    }, [])

    const populateSpecialities = (medicalSpecialties: MedicalSpecialty[]) => {
        setMedicalSpecialties(medicalSpecialties)
    }

    const stopLoading = () => {
        setIsLoading(false)
    }
    const SpecialityCard = ({data}) => {
        return (
            <View style={AppStyle.topHotelCard}>
                <View
                    style={{
                        flexDirection: 'row',
                    }}>
                    <Image
                        style={AppStyle.topHotelCardImage}
                        source={configs.images.doctor}
                        resizeMode={'contain'}
                    />
                    <View style={{paddingVertical: 5, paddingHorizontal: 10, alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={{fontSize: 15, fontWeight: 'bold',color: colors.gray}}>
                            {data.name}
                        </Text>
                    </View>
                </View>


            </View>
        );
    };
    return (
        <View style={{marginBottom: 20}}>
            <FlatList
                data={medicalSpecialties}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                    paddingLeft: 10,
                    marginTop: 20,
                    paddingBottom: 30,
                }}
                renderItem={({item}) => <SpecialityCard data={item} />}
            />
        </View>
    );
};

export default FeaturedSpecialities;
