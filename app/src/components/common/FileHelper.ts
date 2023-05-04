import ImagePicker from 'react-native-image-crop-picker'
import { FileUpload } from '../../interfaces'
const mime = require('mime-types')

const takePhotoFromCamera = (): Promise<any> => {
    return new Promise((resolve, reject) => {
        ImagePicker.openCamera({
            width: 300,
            height: 400,
            cropping: true,
            compressImageQuality: 0.7,
        }).then(image => {
            resolve(image)
        }).catch(error => reject(error))
    })
}

const choosePhotoFromLibrary = (): Promise<any> => {
    return new Promise((resolve, reject) => {
        ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true,
            includeBase64: false,
            includeExif: true,
            mediaType: 'photo',
        }).then(image => {
            resolve(image)
        }).catch(error => reject(error))
    })
}

const getImageData = (image: any): FileUpload => {

    const imagePath = image.path
    const mimeType = image.mime
    const fileName = image.path.split('/').pop()
    const fileExtension = mime.extension(mimeType)

    const imageData: FileUpload = {
        uri: imagePath,
        type: mimeType,
        size: image.size,
        name: fileName,
        extension: fileExtension
    }
    return imageData
}

export { takePhotoFromCamera, choosePhotoFromLibrary, getImageData }