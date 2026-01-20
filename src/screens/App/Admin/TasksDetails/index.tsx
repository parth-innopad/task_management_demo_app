import React, { Fragment, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import ScreenContainer from '../../../../components/ScreenContainer';
import { COLORS } from '../../../../utils/theme';
import AppHeader from '../../../../components/AppHeader';
import { ArrowLeft, Calendar, Clock, MapPin, User } from 'lucide-react-native';
import { fs, hs, vs } from '../../../../utils/stylesUtils';
import AppCard from '../../../../components/AppCard';
import AppText from '../../../../components/AppText';
import { textStyles } from '../../../../common/CommonStyles';
import { AppString } from '../../../../common/AppString';
import { Constants } from '../../../../common/Constants';

interface TasksDetailsProps {
    navigation: any;
    route: {
        params: {
            tasks: any
        }
    }
}

const TasksDetails: React.FC<TasksDetailsProps> = ({ navigation, route }) => {

    const tasks = route?.params?.tasks;

    const [showFullDescription, setShowFullDescription] = useState(false);

    const DetailRow = ({
        icon,
        label,
        value,
    }: {
        icon: React.ReactNode;
        label: string;
        value: string;
    }) => {
        return (
            <View style={styles.row}>
                <View style={styles.rowLeft}>
                    <View style={styles.iconWrap}>{icon}</View>
                    <AppText txt={label} style={textStyles.bodySmall} />
                </View>
                <Text style={styles.value}>{value}</Text>
            </View>
        )
    }

    const renderDescription = () => {
        const text = tasks?.taskDescription || '-';
        const limit = 100;

        if (text.length <= limit) return <AppText txt={text} style={[textStyles.bodySmall, { lineHeight: fs(20) }]} />;

        return (
            <Fragment>
                <AppText
                    txt={showFullDescription ? text : text.substring(0, limit) + '...'}
                    style={[textStyles.bodySmall, { lineHeight: fs(20) }]}
                />
                <TouchableOpacity onPress={() => setShowFullDescription(prev => !prev)}>
                    <AppText
                        txt={showFullDescription ? 'Read Less' : 'Read More'}
                        style={[textStyles.bodySmall, { color: COLORS.secondaryPrimary, marginTop: vs(4) }]}
                    />
                </TouchableOpacity>
            </Fragment>
        )
    }

    return (
        <ScreenContainer backgroundColor={COLORS.bg}>
            <AppHeader
                title={AppString.TaskDetails}
                leftIcon={
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <ArrowLeft size={24} color={COLORS.secondaryPrimary} />
                    </TouchableOpacity>
                }
            />

            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                <AppCard style={styles.card}>
                    <AppText
                        txt={tasks?.taskTitle || '-'}
                        style={[textStyles.subtitle, { color: COLORS.blackColor, marginBottom: vs(6) }]}
                    />
                    {renderDescription()}
                </AppCard>

                <AppCard style={styles.card}>
                    <AppText
                        txt={AppString.Assignment}
                        style={[textStyles.primary15, { marginBottom: vs(12) }]}
                    />
                    <DetailRow
                        icon={<User size={14} color={COLORS.secondaryPrimary} />}
                        label={AppString.Employee}
                        value={tasks?.employeeSelect || '—'}
                    />
                </AppCard>

                <AppCard style={styles.card}>
                    <AppText
                        txt={AppString.Schedule}
                        style={[textStyles.primary15, { marginBottom: vs(12) }]}
                    />
                    <DetailRow
                        icon={<Calendar size={14} color={COLORS.secondaryPrimary} />}
                        label={"Start Date"}
                        value={Constants.formatDate(new Date(tasks.startDateTime))}
                    />
                    <DetailRow
                        icon={<Clock size={14} color={COLORS.success} />}
                        label={AppString.StartTime}
                        value={Constants.isoFormatTime(tasks.startDateTime)}
                    />
                    <View style={styles.divider} />
                    <DetailRow
                        icon={<Calendar size={14} color={COLORS.secondaryPrimary} />}
                        label={'End Date'}
                        value={Constants.formatDate(new Date(tasks.endDateTime))}
                    />
                    <DetailRow
                        icon={<Clock size={14} color={COLORS.danger} />}
                        label={AppString.EndTime}
                        value={Constants.isoFormatTime(tasks.endDateTime)}
                    />
                </AppCard>

                {tasks?.location ? (
                    <AppCard style={styles.card}>
                        <AppText
                            txt={AppString.Location}
                            style={[textStyles.primary15, { marginBottom: vs(12) }]}
                        />
                        <DetailRow
                            icon={<MapPin size={14} color={COLORS.secondaryPrimary} />}
                            label={AppString.WorkLocation}
                            value={tasks.location}
                        />
                    </AppCard>
                ) : null}
            </ScrollView>
        </ScreenContainer>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: hs(16),
        paddingBottom: vs(40),
    },
    card: {
        backgroundColor: COLORS.card,
        borderRadius: 16,
        padding: hs(16),
        marginBottom: vs(14),
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: vs(8),
    },
    rowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: hs(10),
    },
    iconWrap: {
        width: 30,
        height: 30,
        borderRadius: 10,
        backgroundColor: COLORS.secondaryPrimary + '12',
        alignItems: 'center',
        justifyContent: 'center',
    },
    value: {
        fontSize: fs(14),
        color: COLORS.blackColor,
        fontWeight: '600',
        maxWidth: '55%',
        textAlign: 'right',
    },
    divider: {
        height: 1,
        backgroundColor: '#EEF2F6',
        marginVertical: vs(6),
    },
});

export default TasksDetails;
