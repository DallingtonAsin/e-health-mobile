import React from 'react'
import DatePicker from 'react-native-date-picker'

interface DatePickerProps {
    mode?: any;
    title?: string,
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    date: Date;
    handleConfirm: (date: Date) => void;
}

const AppDatePicker: React.FC<DatePickerProps> = ({ mode = "date", title= 'Select date', open, setOpen, date, handleConfirm }) => {
    return (
        <DatePicker
            modal={true}
            mode={mode}
            title={title}
            open={open}
            date={date}
            onConfirm={handleConfirm}
            onCancel={() => {
                setOpen(false)
            }}
        />
    )
}

export default AppDatePicker