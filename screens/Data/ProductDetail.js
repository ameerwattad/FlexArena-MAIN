import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView } from 'react-native';
import rncStyles from 'rncstyles';

const ProductDetail = ({ route }) => {
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ProductDetail;
