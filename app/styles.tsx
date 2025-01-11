import { StyleSheet } from 'react-native';
import { AppColors } from '@/constants/colors';
import { fontSize } from '@/constants/fonts';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: AppColors.external.primary
    },
    logoContainer: {
        paddingHorizontal: 15,
    },
    logoPlaceholder: {
        backgroundColor: '#D9D9D9',
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginTop: 60,
    },
    logoImage: {
        flex: 1,
        height: '100%',
        width: '100%',
        backgroundColor: '#1A73E8'
    },
    formContainer: {
        paddingHorizontal: 15,
        paddingVertical: 30,
        justifyContent: 'space-between',
        backgroundColor: 'white',
        height: 270,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
    },
    headerText: {
        fontSize: fontSize.titles.large,
        fontWeight: 'bold',
    },
    submitButtonText: {
        fontSize: fontSize.labels.medium,
        color: AppColors.external.text,
        fontWeight: 'bold',
    },
    submitButton: {
        flexDirection: 'row',
        backgroundColor: AppColors.external.button,
        width: '100%',
        height: 52,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 4,
        borderRadius: 10,
    },
    buttonWrapper: {
        borderRadius: 8,
        marginTop: 20
    },

});

export default styles;