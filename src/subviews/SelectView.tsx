import React from "react";
import { FlatList, Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { hs, vs } from "../utils/stylesUtils";
import { Constants } from "../common/Constants";
import { fs } from "../utils/stylesUtils";
import { COLORS } from "../utils/theme";
import AppText from "../components/AppText";
import { textStyles } from "../common/CommonStyles";
import { AppString } from "../common/AppString";

const SelectView = (props: any) => {
    return (
        <Modal
            animationType="none"
            transparent={true}
            visible={props.isOpenSheet}
            onRequestClose={() => { }}
        >
            <Pressable style={styles.mainViewContainer} onPress={props.close}>
                <View style={styles.mainView}>
                    <ScrollView
                        style={styles.ScrollView}
                        contentContainerStyle={{ paddingBottom: vs(50) }}
                        showsVerticalScrollIndicator={false}
                    >
                        <AppText
                            txt={AppString.SelectAnyOne}
                            style={[textStyles.title, { marginTop: vs(15), marginHorizontal: hs(25), textAlign: 'center' }]}
                        />
                        <FlatList
                            data={Constants.selectView}
                            renderItem={({ item, index }) => {
                                return (
                                    <TouchableOpacity
                                        style={{ marginTop: vs(20), marginHorizontal: hs(20) }} key={index}
                                        onPress={() => props.openPicker(item.id)}
                                    >
                                        <AppText
                                            txt={item.select}
                                            style={[textStyles.body, { color: COLORS.primary, }]}
                                        />
                                    </TouchableOpacity>
                                )
                            }}
                        />
                        <TouchableOpacity style={{ width: Constants.width, backgroundColor: COLORS.card }} onPress={props.close}>
                            <AppText
                                txt={AppString.Cancel}
                                style={[textStyles.subtitle, { color: COLORS.primary, marginTop: vs(50), textAlign: 'center', textDecorationLine: 'underline' }]}
                            />
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </Pressable>
        </Modal>
    )
}

const styles = StyleSheet.create({
    mainViewContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    mainView: {
        height: vs(320),
        width: '100%',
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
    },
    ScrollView: {
        height: Constants.height,
        width: '100%',
        marginTop: vs(75),
        paddingBottom: vs(20),
        backgroundColor: COLORS.card,
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
    },
})

export default SelectView;