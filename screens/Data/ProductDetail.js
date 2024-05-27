import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, KeyboardAvoidingView, TextInput } from 'react-native';
import rncStyles from 'rncstyles';
import RelatedProductsData from './RelatedProductData'; // Import related products data
import { Rating } from 'react-native-ratings';

const ProductDetail = ({ route, navigation }) => {
  const { product } = route.params;

  const [quantity, setQuantity] = useState(1);
  const [comment, setComment] = useState('');
  const [totalPrice, setTotalPrice] = useState(product.price);
  const [reviews, setReviews] = useState([]);

  const handleIncrement = () => {
    setQuantity(quantity + 1);
    setTotalPrice((quantity + 1) * product.price);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      setTotalPrice((quantity - 1) * product.price);
    }
  };

  const handleAddToCart = () => {
    // Add logic to add the product to the cart
    console.log('Product added to cart');
  };

  const handleSubmitReview = () => {
    if (comment.trim() !== '') {
      const newReview = {
        author: 'Your Name', // Change to user's name or remove this line if not needed
        comment: comment.trim(),
      };
      setReviews([...reviews, newReview]);
      setComment('');
    }
  };

  const handleRelatedProductPress = (relatedProduct) => {
    // Navigate to the related product details screen
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
          {/* Display the price here */}
          <Text style={[rncStyles.fs4, rncStyles.textPrimary, rncStyles.textBold]}>
            Price: ${totalPrice}
          </Text>
        </View>
        <View style={[rncStyles.flexRow, rncStyles.mb2]}>
          <TouchableOpacity
            style={[rncStyles.btnPrimary, rncStyles.rounded, rncStyles.p1]}
            onPress={handleDecrement}>
            <Text style={[rncStyles.textWhite, rncStyles.textCenter]}>-</Text>
          </TouchableOpacity>
          <View
            style={[rncStyles.btnPrimary, rncStyles.rounded, rncStyles.p1, rncStyles.mx2]}>
            <Text style={[rncStyles.textWhite, rncStyles.textCenter]}>
              {quantity}
            </Text>
          </View>
          <TouchableOpacity
            style={[rncStyles.btnPrimary, rncStyles.rounded, rncStyles.p1]}
            onPress={handleIncrement}>
            <Text style={[rncStyles.textWhite, rncStyles.textCenter]}>+</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[rncStyles.btnPrimary, rncStyles.rounded, rncStyles.p2]}
          onPress={handleAddToCart}>
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
          <TextInput
            placeholder="Add a comment..."
            style={[rncStyles.input, rncStyles.p1, rncStyles.mt2, rncStyles.border1, rncStyles.borderPrimary, rncStyles.rounded]}
            multiline={true}
            value={comment}
            onChangeText={text => setComment(text)}
            onSubmitEditing={handleSubmitReview}
          />
          <TouchableOpacity
            style={[rncStyles.btnPrimary, rncStyles.rounded, rncStyles.p1, rncStyles.mt2]}
            onPress={handleSubmitReview}>
            <Text style={[rncStyles.textWhite, rncStyles.textCenter]}>
              Submit
            </Text>
          </TouchableOpacity>
        </View>
        {/* Related Products Section */}
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
        {/* End of Related Products Section */}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ProductDetail;
