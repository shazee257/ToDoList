import React, { Component } from "react";
import { StyleSheet, Text, View, AsyncStorage, ScrollView } from "react-native";
import { Appbar, TextInput, Button, Card, List } from "react-native-paper";

export default class App extends Component {
  arr = [];
  id = 1;
  state = {
    text: "",
    item: [{ id: 0, data: "Test" }],
  };

  removeItem = async (Id) => {
    const arrayCopy = this.state.item.filter((row) => row.id !== Id);
    this.arr = arrayCopy;
    await AsyncStorage.setItem("myList", JSON.stringify(this.arr));
    this.setState({ item: arrayCopy });
  };

  async componentDidMount() {
    this.setState({
      item: JSON.parse(await AsyncStorage.getItem("myList")) || "",
    });
    this.arr = JSON.parse(await AsyncStorage.getItem("myList")) || [];
    if (this.arr.length > 0) {
      this.id = this.arr[this.arr.length - 1].id + 1;
    }
  }

  storeData = async () => {
    if (this.state.text) {
      this.arr.push({ id: this.id, data: this.state.text });
      this.id++;
      await AsyncStorage.setItem("myList", JSON.stringify(this.arr));
      this.setState({
        item: JSON.parse(await AsyncStorage.getItem("myList")),
      });
    }
  };

  render() {
    if (this.state.item.length > 0) {
      renderList = this.state.item.map((item) => {
        return (
          <Card key={item.id} style={{ margin: 8 }}>
            <List.Item
              title={item.data}
              description={`Item ID :${item.id}`}
              right={() => <List.Icon icon="delete" />}
            />
            <Button onPress={() => this.removeItem(item.id)}>
              Remove Item
            </Button>
          </Card>
        );
      });
    } else {
      renderList = (
        <Text style={{ fontSize: 20, margin: 8, textAlign: "center" }}>
          No items in ToDo List
        </Text>
      );
    }

    return (
      <View style={styles.container}>
        <Appbar.Header>
          <Appbar.Content title="TODO LIST" />
        </Appbar.Header>
        <TextInput
          label="Add ToDo Item"
          value={this.state.text}
          onChangeText={(text) => this.setState({ text })}
        />
        <Button mode="contained" onPress={this.storeData} style={{ margin: 8 }}>
          Add ToDo
        </Button>
        <ScrollView>
          <View>{renderList}</View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#d3d3d3",
  },
  scrollView: {
    backgroundColor: "pink",
    marginHorizontal: 20,
  },
});
