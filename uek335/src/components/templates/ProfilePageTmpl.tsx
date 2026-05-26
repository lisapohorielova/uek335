import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
} from 'react-native';
import { Colors, Fonts } from '@/constants/theme';
import {ShadowButton} from "@/components/atoms/ShadowButton";
import {deleteAccount, getUser, logoutUser} from "@/services/UserService";
import {User} from "@/types/User";
import { getStoredUser} from "@/services/SecureStore";


export default function ProfilePage() {
    const [user, setUser] = useState<User | null >(null);

    useEffect(() => {
        const fetchUser = async () => {
            const stored = await getStoredUser();
            if (!stored) return;
            const user = await getUser(stored.id);
            setUser(user);
        };
        fetchUser().then(() => {});
    }, []);

    const Field = ({ label, value }: { label: string; value: string }) => (
        <View style={styles.fieldContainer}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.inputWrapper}>
                <Text style={styles.inputText}>{value}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.safe} >
            <View style={styles.container}>
                <View style={styles.avatarWrapper}>
                    <Image
                        source={require("../../assets/EmtyUserIcon.png")}
                        style={styles.avatar}
                        resizeMode="contain"
                    />
                </View>


                <View style={styles.form}>

                    <Field label="FIRST NAME" value={user?.firstname ?? '—'} />
                    <Field label="LAST NAME" value={user?.lastname ?? '—'} />
                    <Field label="EMAIL" value={user?.email ?? '—'} />
                    <Field label="AGE" value={user ? `${user.age}` : '—'} />
                </View>
            </View>

            <View style={styles.buttonContainer}>
                <ShadowButton text={"LOGOUT"} onPress={logoutUser}/>
                <ShadowButton text={"DELETE"} onPress={() => user && deleteAccount(user.id)}/>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    safe: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.main.dark,
        height: '100%',
        width: '100%',
        padding: 10,
    },
    container: {
        alignItems: 'center',
        width: '100%',
        backgroundColor: Colors.main.dark,
        padding: 20,
        flexDirection: 'column',
        gap: 30,
        paddingBottom: 10,
    },
    header: {
        height: 100,
        width: '100%',
        borderRadius: 22,
        marginTop: 30,
        flexDirection: 'column',
        shadowColor: Colors.main.main,
        shadowOffset: { width: 2, height: 5 },
        shadowOpacity: 0.35,
        shadowRadius: 3.84,
        elevation: 5,
        justifyContent: 'center',
    },
    textCormorant: {
        fontSize: 28,
        color: Colors.main.background,
        fontFamily: Fonts.cormorantBold,
        marginLeft: 30,
        top: -20,
    },
    avatarWrapper: {
        marginTop: -30,
        alignItems: 'center',
        zIndex: 10,
    },
    avatar: {
        width: 90,
        height: 90,
        borderRadius: 45,
        borderWidth: 3,
        borderColor: Colors.main.mid,
        backgroundColor: Colors.main.main,
    },
    form: {
        width: '100%',
        backgroundColor: Colors.main.main,
        padding: 24,
        borderRadius: 22,
        shadowColor: Colors.main.main,
        shadowOffset: { width: 2, height: 5 },
        shadowOpacity: 0.35,
        shadowRadius: 3.84,
        elevation: 5,
        gap: 4,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: Colors.main.background,
        letterSpacing: -0.5,
        fontFamily: Fonts.cormorantBold,
    },
    subtitle: {
        fontSize: 14,
        color: Colors.main.light,
        marginTop: 2,
        fontFamily: Fonts.jost,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.main.mid,
        marginVertical: 16,
        opacity: 0.4,
    },
    fieldContainer: {
        marginBottom: 14,
    },
    label: {
        fontSize: 11,
        fontWeight: '600',
        color: Colors.main.light,
        marginBottom: 6,
        letterSpacing: 1,
        textTransform: 'uppercase',
        fontFamily: Fonts.jost,
    },
    inputWrapper: {
        backgroundColor: Colors.main.dark,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.main.mid,
        paddingHorizontal: 16,
        paddingVertical: 13,
    },
    inputText: {
        fontSize: 15,
        color: Colors.main.background,
        fontFamily: Fonts.jost,
    },
    buttonContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
    }
});