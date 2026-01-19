import { View, TouchableOpacity, StyleSheet, FlatList } from 'react-native'
import React, { useState } from 'react'
import ScreenContainer from '../../../../components/ScreenContainer';
import { COLORS } from '../../../../utils/theme';
import AppHeader from '../../../../components/AppHeader';
import { NavigationKeys } from '../../../../common/NavigationKeys';
import { Plus, ArrowLeft, Search, X } from 'lucide-react-native';
import { fs, hs, vs } from '../../../../utils/stylesUtils';
import AppAvatar from '../../../../components/AppAvatar';
import AppTextInput from '../../../../components/AppTextInput';
import { useSelector } from 'react-redux';
import { AppString } from '../../../../common/AppString';
import AppKeyboardScrollView from '../../../../components/AppKeyboardScrollView';
import AppText from '../../../../components/AppText';
import { textPrimary17, textStyles } from '../../../../common/CommonStyles';

interface EmployeeListProps {
    navigation: any;
}

const EmployeesListScreen: React.FC<EmployeeListProps> = ({ navigation }) => {

    const [state, setState] = useState<{
        search: string;
    }>({
        search: '',
    });

    const employeesLists = useSelector((state: any) => state.appData.createEmployee);

    const filteredEmployees = employeesLists.filter((emp: any) => {
        const matchesSearch = emp.name.toLowerCase().includes(state.search.toLowerCase());
        return matchesSearch;
    });

    return (
        <ScreenContainer backgroundColor={COLORS.bg}>
            <AppHeader
                title={AppString.EmployeeList}
                leftIcon={
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <ArrowLeft size={25} color={COLORS.secondaryPrimary} />
                    </TouchableOpacity>
                }
            />

            <AppTextInput
                placeholder={AppString.SearchEmployee}
                placeholderTextColor={COLORS.greyColor}
                rightIcon={state.search ?
                    <X size={20} color={COLORS.danger} onPress={() => setState((prev) => ({ ...prev, search: '' }))} />
                    : <Search size={20} color={COLORS.secondaryPrimary} />}
                containerStyle={styles.searchInputContainerStyle}
                value={state.search}
                onChangeText={(text: any) => setState((prev) => ({
                    ...prev,
                    search: text
                }))}
            />

            <AppKeyboardScrollView>
                <FlatList
                    data={filteredEmployees}
                    keyExtractor={(_, index) => index.toString()}
                    contentContainerStyle={styles.contentContainerStyle}
                    renderItem={({ item, index }) => {
                        return (
                            <TouchableOpacity
                                key={index}
                                style={styles.card}
                                onPress={() => navigation.navigate(NavigationKeys.EmployeeDetails, { employeeId: item.id })}
                            >
                                <AppAvatar uri={item.file?.uri} />
                                <View style={{ marginLeft: hs(15), flex: 1 }}>
                                    <AppText
                                        txt={item.name}
                                        style={textPrimary17}
                                    />
                                    <AppText
                                        txt={item.designation}
                                        style={[textStyles.bodySmall, { color: '#788AA3', marginTop: vs(5) }]}
                                    />
                                </View>
                            </TouchableOpacity>
                        )
                    }}
                    ListEmptyComponent={
                        <AppText
                            txt={AppString.NoResultsFound}
                            style={[textStyles.emptyText, { color: COLORS.greyColor, textAlign: 'center', marginTop: vs(50) }]}
                        />
                    }
                />
            </AppKeyboardScrollView>

            <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate(NavigationKeys.CreateEditEmployee)}>
                <Plus size={25} color={"#fff"} />
            </TouchableOpacity>
        </ScreenContainer>
    )
}

const styles = StyleSheet.create({
    addBtn: {
        height: vs(60),
        width: hs(60),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        backgroundColor: '#6C47FF',
        position: 'absolute',
        bottom: vs(50),
        right: hs(20)
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 15,
        marginBottom: vs(15),
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3
    },
    contentContainerStyle: {
        padding: 20,
        paddingBottom: vs(50),
        marginTop: vs(10)
    },
    searchInputContainerStyle: {
        marginHorizontal: hs(20),
        marginTop: vs(20)
    },
})

export default EmployeesListScreen;