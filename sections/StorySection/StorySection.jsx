import { StyleSheet, View, ScrollView } from 'react-native';
import React from 'react';
import SingleStory from '../../components/story/SingleStory';
import OwnerStory from '../../components/story/OwnerStory';

const StorySection = () => {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false} // Hides the scrollbar
            contentContainerStyle={styles.scrollContainer}
        >
            <OwnerStory />
            <SingleStory />
            <SingleStory />
            <SingleStory />
            <SingleStory />
            <SingleStory />
            <SingleStory />
            <SingleStory />
        </ScrollView>
    );
};

export default StorySection;

const styles = StyleSheet.create({
    scrollContainer: {
        flexDirection: "row", // Ensure the stories are laid out in a row
        alignItems: "center", // Center stories vertically
        paddingHorizontal: 10,
        gap: 12 // Add some padding to the sides
    },
});
