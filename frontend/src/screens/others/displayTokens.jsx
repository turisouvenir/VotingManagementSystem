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
import { getAllTokensByMeterNumber } from "../../services/auth";
import Input from "../../components/input";

const DisplayTokens = ({ navigation }) => {
    const [loading, setLoading] = useState(false);
    const [authError, setAuthError] = useState("");
    const [tokens, setTokens] = useState([]);

    const initialValues = {
        meterNumber: "",
    };

    const validationSchema = Yup.object().shape({
        meterNumber: Yup.number()
            .typeError("Meter Number should be a number")
            .integer("Meter Number should be an integer")
            .positive("Meter Number should be a positive number")
            .test(
                "length",
                "Meter number should have exactly 6 digits",
                (val) => val.toString().length === 6
            )
            .required("Meter number is required"),

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
        if (isValid && values.meterNumber !== '') {
            setLoading(true);
            const res = await getAllTokensByMeterNumber(values.meterNumber);
            setLoading(false);
            console.log(res);
            if (res?.message) {
                if (res.tokens.length !== 0) {
                    setAuthError("Tokens retrieved successfully");
                    setTokens(res.tokens)
                    console.log(tokens);
                }
                else {
                    setTokens([])
                    setAuthError("No tokens for that meter number");
                }
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
                            <Text style={tw`mt-4 text-red-500 text-center`}>{authError}</Text>
                        )}
                        <View style={tw`mt-2`}>
                            <View style={tw`px-6 py-2`}>
                                <Input
                                    Icon={
                                        <MaterialIcons
                                            name="person-outline"
                                            size={24}
                                            color="silver"
                                        />
                                    }
                                    placeholder="Meter Number"
                                    isNumeric={true}
                                    onChangeText={handleChange("meterNumber")}
                                    onBlur={handleBlur("meterNumber")}
                                    value={values.meterNumber}
                                    borderColor={touched.meterNumber && errors.meterNumber ? "red" : "gray"}
                                />
                                {touched.meterNumber && errors.meterNumber && (
                                    <Text style={tw`text-red-500`}>{errors.meterNumber}</Text>
                                )}


                                <View style={tw`mt-2`}>
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
                                {tokens.length !== 0 &&


                                    <View style={tw`mt-2`}>
                                        <Text style={tw`text-xl text-[#193074]`}>
                                            List of retrieved Tokens
                                        </Text>
                                        {tokens.map((token, index) => (
                                            <View
                                                key={index}
                                                style={tw`bg-gray-200 rounded p-4 mt-2`}
                                            >
                                                <Text style={tw`font-bold`}>Token: {token.token}</Text>
                                                <Text>Status: {token.tokenStatus}</Text>
                                                <Text>Value Days: {token.tokenValueDays}</Text>
                                                <Text>Amount: {token.amount}</Text>
                                                <Text>Purchased Date: {token.purchasedDate}</Text>
                                            </View>
                                        ))}
                                    </View>
                                }
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

export default DisplayTokens;
