import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, KeyboardAvoidingView, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import rncStyles from 'rncstyles';
import RelatedProductsData from './RelatedProductData';
import { Rating } from 'react-native-ratings';

const ProductDetail = ({ route, navigation }) => {
  const { product } = route.params;

  const [quantity, setQuantity] = useState(1);
  const [comment, setComment] = useState('');
  const [totalPrice, setTotalPrice] = useState(product.price);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const savedReviews = await AsyncStorage.getItem(`product_reviews_${product.id}`);
      if (savedReviews !== null) {
        setReviews(JSON.parse(savedReviews));
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  };

  const saveReview = async (newReviews) => {
    try {
      await AsyncStorage.setItem(`product_reviews_${product.id}`, JSON.stringify(newReviews));
    } catch (error) {
      console.error('Error saving review:', error);
    }
  };

  const handleSubmitReview = () => {
    if (comment.trim() !== '') {
      const newReview = {
        author: 'Your Name', // Change to user's name or remove this line if not needed
        comment: comment.trim(),
      };
      const newReviews = [...reviews, newReview];
      setReviews(newReviews);
      setComment('');
      saveReview(newReviews);
    }
  };

  const handleRelatedProductPress = (relatedProduct) => {
    navigation.navigate('ProductDetail', { product: relatedProduct });
  };

  return (
    <KeyboardAvoidingView style={[rncStyles.h100, rncStyles.bgWhite]} behavior="padding" enabled>
      <ScrollView contentContainerStyle={rncStyles.p2}>
        <View style={[rncStyles.flexCenter, rncStyles.mb2]}>
          <Image
            resizeMode="contain"
            style={[rncStyles.rounded, { width: '80%', height: 200 }]}
            source={product.image}
          />
        </View>
        <View style={rncStyles.mb2}>
          <Text style={[rncStyles.fs3, rncStyles.textPrimary, rncStyles.textBold]}>
            {product.name}
          </Text>
        </View>
        <View style={rncStyles.mb2}>
          <Text style={rncStyles.textSecondary}>
            {product.description}
          </Text>
        </View>
        <View style={rncStyles.mb2}>
          <Text style={[rncStyles.fs4, rncStyles.textPrimary, rncStyles.textBold]}>
            Price: ${totalPrice}
          </Text>
        </View>
        <View style={[rncStyles.flexRow, rncStyles.mb2]}>
          {/* Quantity selection buttons */}
       
        </View>
        <TouchableOpacity
          style={[rncStyles.btnPrimary, rncStyles.rounded, rncStyles.p2]}
          onPress={() => console.log('Add to Cart pressed')}>
          <Text style={[rncStyles.textWhite, rncStyles.textCenter]}>
            Add to Cart
          </Text>
        </TouchableOpacity>
       

   
        <View style={rncStyles.mb2}>
          <Text
            style={[rncStyles.mt4, rncStyles.fs5, rncStyles.textPrimary, rncStyles.textBold]}>
            Reviews and Comments
          </Text>
          {reviews.map((review, index) => (
            <View key={index} style={rncStyles.mt2}>
              <Text style={rncStyles.textSecondary}>
                {review.author ? `${review.author}: ` : ''}
                {review.comment}
              </Text>
            </View>
          ))}
        </View>
        <View style={rncStyles.mb2}>
          <TextInput
            placeholder="Add a comment..."
            style={[rncStyles.input, rncStyles.p1, rncStyles.mt2, rncStyles.border1, rncStyles.borderPrimary, rncStyles.rounded]}
            multiline={true}
            value={comment}
            onChangeText={text => setComment(text)}
          />
        </View>
        <TouchableOpacity
          style={[rncStyles.btnPrimary, rncStyles.rounded, rncStyles.p2]}
          onPress={handleSubmitReview}>
          <Text style={[rncStyles.textWhite, rncStyles.textCenter]}>
            Submit Review
          </Text>
        </TouchableOpacity>
        <View style={rncStyles.mb2}>
          <Text
            style={[rncStyles.mt4, rncStyles.fs5, rncStyles.textPrimary, rncStyles.textBold]}>
            Related Items
          </Text>
          <ScrollView horizontal={true} style={rncStyles.mt2}>
            {RelatedProductsData[product.name] && RelatedProductsData[product.name].map((relatedProduct, index) => (
              <TouchableOpacity key={index} style={[rncStyles.mr2, { maxWidth: 150, marginRight: 10 }]} onPress={() => handleRelatedProductPress(relatedProduct)}>
                <Image
                  resizeMode="contain"
                  style={{ width: 100, height: 100 }}
                  source={relatedProduct.image}
                />
                <Text style={[rncStyles.textCenter, { marginTop: 5 }]}>
                  {relatedProduct.name.split(' ').reduce((acc, curr, index) => {
                    const isNewLineNeeded = index % 2 === 0;
                    return isNewLineNeeded ? `${acc}\n${curr}` : `${acc} ${curr}`;
                  }, '')}
                </Text>
                <Rating
                  type='star'
                  ratingCount={5}
                  imageSize={20}
                  startingValue={relatedProduct.rating}
                  readonly
                  style={rncStyles.relatedProductRating}
                />
                <Text style={rncStyles.relatedProductPrice}>{`Price: $${relatedProduct.price.toFixed(2)}`}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default ProductDetail;
