import React from 'react'
import { StyleSheet } from 'react-native'
import { SelectList, MultipleSelectList } from 'react-native-dropdown-select-list'

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
            search={true} />
    )
}

const CustomMultipleSelectDropdown = ({
    data,
    selected = [],
    onSelect,
    placeholder = 'Select option',
}: {
    data: any,
    selected?: any,
    onSelect: any,
    placeholder?: string,
}) => {

    const [selectedItem, setSelectedItem] = React.useState(selected)
    const handleOnSelect = () => {
        onSelect(selectedItem)
    }
    return (
        <MultipleSelectList
            setSelected={(val: any) => setSelectedItem(val)}
            data={data}
            save="value"
            placeholder={placeholder}
            onSelect={() => handleOnSelect()}
            search={true} />
    )
}


export { CustomSingleSelectDropdown, CustomMultipleSelectDropdown }

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