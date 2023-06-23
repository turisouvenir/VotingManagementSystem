import React, { useEffect, useState } from "react";
import { View, Text, Pressable, SafeAreaView, ScrollView } from "react-native";
import * as SecureStore from "expo-secure-store";
import tw from "twrnc";
import MyButton from "../../components/button";
import { getProfile } from "../../services/auth";
import { useIsFocused } from "@react-navigation/native";

const Home = ({ navigation }) => {
  const [user, setUser] = useState("");
  const [authError, setAuthError] = useState("");
  const isFocused = useIsFocused();

  const getUserProfile = async () => {
    try {
      const profile = await getProfile();
      if (!profile?.data) return navigation.navigate("Login");
      setUser(profile?.data);

      const res = await getCandidates();
      setCandidates(res?.data?.docs || []);
    } catch (error) {
      console.log("Error fetching user profile or candidates:", error);
      setAuthError("Failed to fetch data. Please try again.");
    }
  };

  useEffect(() => {
    isFocused && getUserProfile()
  }, [isFocused]);

  const handleLogout = () => {
    SecureStore.deleteItemAsync("token");
    navigation.navigate("Login");
  };

  return (
    <View style={tw`h-full flex pt-20 items-center`}>
      <SafeAreaView>
        <ScrollView>
          <View>
            <Text style={tw`font-bold text-xl text-center`}>
              Welcome in TGS
            </Text>
            <Text style={tw`font-bold text-xl text-center mb-10`}>
              {user.names}
            </Text>

            <View>
              <Text style={tw`font-bold text-xl text-center mb-10`}>
                Choose An Action
              </Text>
            </View>
            <View>
              <Pressable onPress={() => { navigation.navigate('GenerateToken') }}>
                <MyButton
                  style={tw`bg-[#193074] text-white mb-4 w-full rounded-[10px]`}
                >
                  GENERATE TOKEN
                </MyButton>
              </Pressable>
            </View>
            <View>

              <Pressable onPress={() => { navigation.navigate("ValidateToken"); }}>
                <MyButton
                  style={tw`bg-[#193074] text-white mb-4 w-full rounded-[10px]`}
                >
                  VALIDATE TOKEN
                </MyButton>
              </Pressable>
            </View>
            <View>
              <Pressable onPress={() => { navigation.navigate('DisplayTokens') }}>
                <MyButton
                  style={tw`bg-[#193074] text-white mb-4 w-full rounded-[10px]`}
                >
                  DISPLAY TOKENS BY METER
                </MyButton>
              </Pressable>
            </View>
            <View>
              <Pressable onPress={handleLogout}>
                <MyButton
                  style={tw`bg-red-500 text-white mb-4 w-full rounded-[10px]`}
                >
                  LOGOUT
                </MyButton>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default Home;
