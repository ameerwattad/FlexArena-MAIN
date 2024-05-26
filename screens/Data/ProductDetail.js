import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput } from 'react-native';
import rncStyles from 'rncstyles';
import ProductData from './ProductData';

const ProductDetail = () => {
  const [quantity, setQuantity] = useState(1);
  const [comment, setComment] = useState('');
  const [totalPrice, setTotalPrice] = useState(ProductData[0].price); // Initialize with the price of the first product

  const handleIncrement = () => {
    setQuantity(quantity + 1);
    setTotalPrice((quantity + 1) * ProductData[0].price); // Update total price based on new quantity
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      setTotalPrice((quantity - 1) * ProductData[0].price); // Update total price based on new quantity
    }
  };

  return (
    <View style={[rncStyles.h100, rncStyles.bgWhite, rncStyles.p2]}>
      <View style={[rncStyles.flexCenter, rncStyles.mb2]}>
        <Image
          resizeMode="contain"
          style={[rncStyles.rounded, { width: '80%', height: 200 }]}
          source={ProductData[0].image}
        />
      </View>
      <View style={rncStyles.mb2}>
        <Text style={[rncStyles.fs3, rncStyles.textPrimary, rncStyles.textBold]}>
          {ProductData[0].name}
        </Text>
      </View>
      <View style={rncStyles.mb2}>
        <Text style={rncStyles.textSecondary}>
          {ProductData[0].description}
        </Text>
      </View>
      <View style={rncStyles.mb2}>
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
        style={[rncStyles.btnPrimary, rncStyles.rounded, rncStyles.p2]}>
        <Text style={[rncStyles.textWhite, rncStyles.textCenter]}>
          Add to Cart
        </Text>
      </TouchableOpacity>
      <View style={rncStyles.mb2}>
        <Text
          style={[rncStyles.mt4, rncStyles.fs5, rncStyles.textPrimary, rncStyles.textBold]}>
          Reviews and Comments
        </Text>
        <TextInput
          placeholder="Add a comment..."
          style={[rncStyles.input, rncStyles.p1, rncStyles.mt2, rncStyles.border1, rncStyles.borderPrimary, rncStyles.rounded]}
          multiline={true}
          value={comment}
          onChangeText={text => setComment(text)}
        />
      </View>
    </View>
  );
};

export default ProductDetail;
