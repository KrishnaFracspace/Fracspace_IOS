
import React from 'react';
import {PixelRatio, Platform, Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');
const realWidth = height > width ? width : height;
const realHeight = height > width ? height : width;


const APPBAR_HEIGHT = Platform.OS === 'ios' ? 49 : 56;
const TABBAR_HEIGHT = 40;



const relativeWidth = num => (realWidth * num) / 100;
const relativeHeight = num => (realHeight * num) / 100;

const fontBaseXSmall = 12;
const fontBaseSmall = 15;
const fontBaseNormal = 17;
const fontBaseLarge = 20;
const fontBaseXLarge = 24;
const fontBaseXXLarge = 28;
const HEADER_HEIGHT =  relativeHeight(10);
const IaminModalHeight =  7; // bottom iamin modal height
const IaminRelativeHeight =  relativeHeight(7);// bottom iamin relative modal height

const isTablet = () => {
    let pixelDensity = PixelRatio.get();
    let adjustedWidth = width * pixelDensity;
    let adjustedHeight = height * pixelDensity;
    if (pixelDensity < 2 && (adjustedWidth >= 1000 || adjustedHeight >= 1000)) {
        return true;
    } else return pixelDensity === 2 && (adjustedWidth >= 1920 || adjustedHeight >= 1920);
};

const responsiveFontSize = (fontSize) => {
    let divider = isTablet() ? 600 : 375;
    return Math.round(fontSize * realWidth / divider);
};

const fontXSmall = responsiveFontSize(fontBaseXSmall);
const fontSmall = responsiveFontSize(fontBaseSmall);
const fontNormal = responsiveFontSize(fontBaseNormal);
const fontLarge = responsiveFontSize(fontBaseLarge);
const fontXLarge = responsiveFontSize(fontBaseXLarge);
const fontXXLarge = responsiveFontSize(fontBaseXXLarge);

const responsiveHeight = (height) => {
    if (!isTablet())
        return height;
    else
        return (height + (height * 0.25));
};

export default {
    fontXSmall, fontSmall, fontNormal, fontLarge, fontXLarge, fontXXLarge, responsiveHeight,
    relativeWidth, relativeHeight, responsiveFontSize, APPBAR_HEIGHT,TABBAR_HEIGHT,HEADER_HEIGHT,IaminModalHeight,IaminRelativeHeight
};