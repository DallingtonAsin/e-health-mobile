import React from 'react'
import { StyleSheet } from 'react-native'
import SearchableDropdown from 'react-native-searchable-dropdown'
import { SelectList, MultipleSelectList } from 'react-native-dropdown-select-list'
import { Option } from '../interfaces'

const SingleSearchableDropdown = ({ selectedItem, items, placeholderStr, textInputStr, defaultIndex, onItemSelect }: {
    selectedItem: Option,
    items: Option[],
    placeholderStr: string,
    textInputStr: string,
    defaultIndex?: number,
    onItemSelect: (item: any) => void
}) => (
    <SearchableDropdown
        onItemSelect={(item) => onItemSelect(item)}
        containerStyle={{ padding: 5 }}
        textInputStyle={styles.searchableTextInputStyle}
        itemStyle={{
            padding: 10,
            marginTop: 2,
            backgroundColor: '#ddd',
            borderColor: '#bbb',
            borderWidth: 1,
            borderRadius: 5,
        }}
        itemTextStyle={{ color: '#222' }}
        itemsContainerStyle={{ maxHeight: 140 }}
        items={items}
        defaultIndex={defaultIndex}
        placeholder={placeholderStr}
        resetValue={false}
        underlineColorAndroid="transparent"
        textInputProps={{
            placeholder: textInputStr,
            underlineColorAndroid: "transparent",
            style: {
                padding: 12,
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 5,
            },
            editable: true,
            value: selectedItem ? selectedItem.name : '',
            onTextChange: (text: any) => console.log(text)
        }}
        listProps={{ nestedScrollEnabled: true }}
    />
)

const CustomSingleSelectDropdown = ({
    data,
    setSelected,
    placeholder = 'Select option'
}: {
    data: any,
    setSelected: React.Dispatch<React.SetStateAction<any>>,
    placeholder?: string
}) => {
    return (
        <SelectList
            setSelected={(val: any) => setSelected(val)}
            data={data}
            save="value"
            placeholder={placeholder}
            search={true}
        />
    )
}

const CustomMultipleSelectDropdown = ({
    data,
    onSelect,
    placeholder = 'Select option',
}: {
    data: any,
    onSelect: any,
    placeholder?: string,
}) => {

    const [selected, setSelected] = React.useState([])
    const handleOnSelect = () => {
        onSelect(selected)
    }
    return (
        <MultipleSelectList
            setSelected={(val: any) => setSelected(val)}
            data={data}
            save="value"
            placeholder={placeholder}
            onSelect={() => handleOnSelect()}
            search={true}
        />
    )
}


export {  SingleSearchableDropdown, CustomSingleSelectDropdown, CustomMultipleSelectDropdown }

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