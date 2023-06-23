import React, { useState } from "react";
import {
    Text,
    SafeAreaView,
    ScrollView,
    View,
    Pressable,
} from "react-native";
import { MaterialIcons, MaterialCommunityIcons, AntDesign } from "@expo/vector-icons";
import * as Yup from "yup";
import { useFormik } from "formik";
import tw from "twrnc";

import Button from "../../components/button";
import { validateToken } from "../../services/auth";
import Input from "../../components/input";

const ValidateToken = ({ navigation }) => {
    const [loading, setLoading] = useState(false);
    const [authError, setAuthError] = useState("");
    const [validToken, setValidToken] = useState("");

    const initialValues = {
        token: "",
    };

    const validationSchema = Yup.object().shape({
        token: Yup.string().length(8).required("Please enter token"),
    });

    const formik = useFormik({
        initialValues,
        validationSchema,
    });

    const {
        handleChange,
        handleBlur,
        values,
        errors,
        touched,
        isValid,
        getFieldProps,
    } = formik;

    const handleSubmit = async () => {
        setAuthError("");
        // Check if all inputs are valid
        if (isValid && values.token !== '') {
            setLoading(true);
            const res = await validateToken(values.token);
            setLoading(false);
            console.log(res);
            if (res?.message) {
                setValidToken(res?.message);
            }
            else {
                setLoading(false)
                setAuthError(res.error);
            }
        }
    };
    return (
        <View style={tw`h-[100%] bg-white  justify-end items-center`}>
            <SafeAreaView style={tw`h-[85%] w-full bg-white `}>
                <ScrollView>
                    <View>
                        <View style={tw`w-full`}>
                            <Text style={tw`text-center font-extrabold text-xl`}>
                                Display tokens
                            </Text>
                        </View>

                        {authError !== '' && (
                            <Text style={tw`mt-4 text-red-500 text-center w-[90%]`}>{authError}</Text>
                        )}
                        <View style={tw`mt-8`}>
                            <View style={tw`px-6 py-2`}>
                                <Input
                                    Icon={
                                        <MaterialIcons
                                            name="person-outline"
                                            size={24}
                                            color="silver"
                                        />
                                    }
                                    placeholder="Enter Token Number"
                                    isNumeric={true}
                                    onChangeText={handleChange("token")}
                                    onBlur={handleBlur("token")}
                                    value={values.token}
                                    borderColor={touched.token && errors.token ? "red" : "gray"}
                                />
                                {touched.token && errors.token && (
                                    <Text style={tw`text-red-500`}>{errors.token}</Text>
                                )}

                                {validToken !== '' && <Text style={tw`text-[#193074] mt-3`}>{validToken}</Text>}

                                <View style={tw`mt-8`}>
                                    <Button
                                        mode={"contained"}
                                        style={tw`bg-[#193074] w-full p-[10] mt-4`}
                                        onPress={handleSubmit}
                                    >
                                        {loading ? "Submitting..." : "Submit"}
                                    </Button>

                                    <Pressable onPress={() => navigation.navigate("Home")}>
                                        <View style={tw`mt-4`}>
                                            <Text style={tw`text-xl underline text-gray-500`}>
                                                Back
                                            </Text>
                                        </View>
                                    </Pressable>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

export default ValidateToken;
