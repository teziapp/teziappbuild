import React from 'react';
import {Document, Page, StyleSheet, Text, View} from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: {
        backgroundColor: "#ffffff"
    },
    movieContainer: {
        backgroundColor: "#f6f6f5",
        display: "flex",
        flexDirection: "row",
        padding: 5
    },
})

export default function PdfDocument(props){
    console.log("pdf props", props.data);
    return (
        <Document>
            <Page style={styles.page}>
            <View style={styles.movieContainer}>
                <Text>Buyer's name: </Text>
            </View>
            </Page>
        </Document>
    )
}