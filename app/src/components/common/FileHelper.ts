import ImageResizer from '@bam.tech/react-native-image-resizer';
import RNFS from 'react-native-fs';

const resizeImage = (response: any) => {

    const assest_obj = response.assets
    const uri = assest_obj[0].uri
    const file_name = assest_obj[0].fileName
    const type = assest_obj[0].type

    return new Promise((resolve, reject) => {
        ImageResizer.createResizedImage(uri, 500, 500, 'JPEG', 80).then((resizedImage: any) => {
            const filePath = resizedImage.uri
            RNFS.readFile(filePath, 'base64').then((base64String) => {
                const source: any = { uri: `data:image/jpeg;base64,${base64String}` };
                const file_obj = {
                    uri: uri,
                    source: source,
                    name: file_name,
                    type: type
                }
                resolve(file_obj)
            });
        }).catch((err: unknown) => {
            reject(err)
        });
    });
};

export { resizeImage }