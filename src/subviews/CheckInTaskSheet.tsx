import React, { Fragment, useState } from 'react'
import { Modal, View, Text, FlatList, Pressable, TouchableOpacity, StyleSheet } from 'react-native'
import { COLORS } from '../utils/theme'
import { fs, hs, vs } from '../utils/stylesUtils'
import { Circle, CheckCircle, X } from 'lucide-react-native'
import AppText from '../components/AppText'
import { textStyles } from '../common/CommonStyles'
import { AppString } from '../common/AppString'
import ErrorModal from './ErrorModal'

interface Props {
    visible: boolean;
    onClose: () => void;
    tasks: any[];
    onStart: (task: any) => void;
}

const CheckInTaskSheet: React.FC<Props> = ({ visible, onClose, tasks, onStart }) => {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [errorModalVisible, setErrorModalVisible] = useState(false);
    return (
        <Modal visible={visible} animationType="none" transparent onRequestClose={onClose}>
            <Pressable style={styles.modalOverlay} onPress={onClose} />
            <View style={styles.sheet}>
                <TouchableOpacity
                    style={{ position: 'absolute', right: 15, top: 10 }}
                    onPress={onClose}
                >
                    <X size={25} />
                </TouchableOpacity>
                {tasks?.length <= 0 ? <AppText txt={AppString.NoTaskFound} style={[textStyles.emptyText, { marginBottom: vs(10), textAlign: 'center' }]} /> :
                    <Fragment>
                        <Text style={styles.title}>{AppString.SelectTask}</Text>
                        <FlatList
                            data={tasks}
                            keyExtractor={(_, index) => index.toString()}
                            renderItem={({ item }) => {
                                const id = item?.tasksId;
                                const title = item?.taskTitle;
                                return (
                                    <Pressable style={styles.taskItem} onPress={() => setSelectedId(id)}>
                                        <View>
                                            <Text style={styles.taskTitle}>{title}</Text>
                                            <Text style={styles.taskMeta}>{AppString.Status} {item.status}</Text>
                                        </View>
                                        <View style={{ alignItems: 'flex-end' }}>
                                            <View style={{ marginTop: vs(8) }}>
                                                {selectedId === id ? <CheckCircle size={20} color={COLORS.secondaryPrimary} /> : <Circle size={20} color="#9CA3AF" />}
                                            </View>
                                        </View>
                                    </Pressable>
                                );
                            }}
                        />
                        <TouchableOpacity style={styles.startButton}
                            onPress={() => {
                                if (!selectedId) {
                                    setErrorModalVisible(true);
                                    return;
                                }
                                const t = tasks.find((x: any) => (x.tasksId || x.taskId) === selectedId);
                                if (t) {
                                    onStart(t);
                                    setSelectedId(null);
                                }
                            }}>
                            <Text style={{ color: '#fff', fontWeight: '700' }}>{AppString.Start}</Text>
                        </TouchableOpacity>
                    </Fragment>
                }
            </View>
            <ErrorModal
                visible={errorModalVisible}
                title={AppString.SelectATask}
                message={AppString.PleaseSelectOneTaskToStart}
                cancel={'OK'}
                onCancel={() => {
                    setErrorModalVisible(false)
                }}
            />
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)'
    },
    sheet: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        padding: 30,
        maxHeight: '60%',
    },
    title: {
        fontSize: fs(18),
        fontWeight: '700',
        color: '#1B1D28',
        marginBottom: vs(8),
        textAlign: 'center'
    },
    taskItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6'
    },
    taskTitle: {
        fontSize: fs(16),
        fontWeight: '700'
    },
    taskMeta: {
        fontSize: fs(13),
        color: '#6B7280',
        marginTop: vs(5)
    },
    priorityBadge: {
        paddingHorizontal: hs(8),
        paddingVertical: 5,
        borderRadius: 8,
        fontSize: fs(12),
        overflow: 'hidden'
    },
    startButton: {
        marginTop: 12,
        backgroundColor: COLORS.secondaryPrimary,
        height: 45, borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default CheckInTaskSheet;
