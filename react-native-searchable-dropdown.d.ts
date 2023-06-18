declare module 'react-native-searchable-dropdown' {
    import { Component, ReactNode } from 'react';
    import { TextStyle, ViewStyle } from 'react-native';

    interface Option {
        id: number;
        name: string;
    }

    interface SearchableDropdownProps {
        onItemSelect: (item: Option | any) => void;
        onRemoveItem?: (item: Option | any) => void;
        multi?: boolean;
        selectedItem?: Option,
        containerStyle?: ViewStyle;
        textInputStyle?: TextStyle;
        itemStyle?: ViewStyle;
        itemTextStyle?: TextStyle;
        itemsContainerStyle?: ViewStyle;
        items: Option[];
        defaultIndex?: number;
        chip?: boolean;
        selectedItems?: Option[];
        placeholder?: string;
        resetValue?: boolean;
        underlineColorAndroid?: string;
        renderIcon?: () => ReactNode;
        textInputProps?: TextInputProps;
        listProps?: FlatListProps<Option>;
    }

    class SearchableDropdown extends Component<SearchableDropdownProps> { }

    export default SearchableDropdown;
}
