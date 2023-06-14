import React from 'react'
import { StyleSheet } from 'react-native'
import SearchableDropdown from 'react-native-searchable-dropdown'
import { Option } from '../interfaces'

const CustomSearchableDropdown = ({ multi, items, selectedItems, placeholderStr, textInputStr, onItemSelect, onRemoveItem }: {
    multi: boolean,
    items: Option[],
    selectedItems: Option[],
    placeholderStr: string,
    textInputStr: string,
    onItemSelect: (item: any) => void,
    onRemoveItem: (item: any) => void
}) => (
    <SearchableDropdown
        multi={multi}
        items={items}
        selectedItems={selectedItems}
        onItemSelect={(item) => onItemSelect(item)}
        onRemoveItem={(item) => onRemoveItem(item)}
        containerStyle={styles.searchableContainerStyle}
        textInputStyle={styles.searchableTextInputStyle}
        itemStyle={styles.searchableItemStyle}
        itemTextStyle={styles.searchableTextStyle}
        itemsContainerStyle={{ maxHeight: 140 }}
        chip={true}
        placeholder={placeholderStr}
        resetValue={false}
        underlineColorAndroid="transparent"
        textInputProps={{
            placeholder: textInputStr,
            underlineColorAndroid: "transparent",
            style: styles.searchableTextInputPropsStyle,
            onTextChange: (text: any) => console.log(text)
        }}
        listProps={{ nestedScrollEnabled: true }}
    />
)
export default CustomSearchableDropdown

const styles = StyleSheet.create({

    searchableContainerStyle: {
        paddingHorizontal: 0,
        marginVertical: 10
    },

    searchableTextInputStyle: {
        padding: 12,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },

    searchableItemStyle: {
        padding: 10,
        marginTop: 8,
        backgroundColor: '#ddd',
        borderColor: '#bbb',
        borderWidth: 1,
        borderRadius: 5,
    },

    searchableTextStyle: {
        color: '#222'
    },

    searchableTextInputPropsStyle: {
        padding: 12,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    }
})