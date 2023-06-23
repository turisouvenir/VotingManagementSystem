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
import { generateToken } from "../../services/auth";
import Input from "../../components/input";

const GenerateToken = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const initialValues = {
    meterNumber: "",
    amount: "",
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
    amount: Yup.number()
      .typeError("Amount should be a number")
      .integer("Amount should be an integer")
      .positive("Amount should be a positive number")
      .min(100, "Amount should be at least 100 Rwf")
      .required("Amount is required"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema
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
    if (isValid) {
      setLoading(true);
      const res = await generateToken(values);
      setLoading(false);
      if (res?.message) {
        setSuccessMessage("Token generated successfully");
        values.meterNumber = ""
        values.amount = ""
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
                Generate Token
              </Text>
            </View>

            {authError !== '' && (
              <Text style={tw`mt-4 text-red-500 text-center`}>{authError}</Text>
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

                <Input
                  Icon={
                    <MaterialIcons
                      name="location-on"
                      size={24}
                      color="silver"
                    />
                  }
                  isNumeric={true}
                  placeholder="Enter amount in RWF"
                  onChangeText={handleChange("amount")}
                  onBlur={handleBlur("amount")}
                  value={values.amount}
                  borderColor={
                    touched.amount && errors.amount ? "red" : "gray"
                  }
                />
                {touched.amount && errors.amount && (
                  <Text style={tw`text-red-500`}>{errors.amount}</Text>
                )}

                {successMessage !== '' && <Text style={tw`text-[#193074] mt-3`}>{successMessage}</Text>}
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

export default GenerateToken;
