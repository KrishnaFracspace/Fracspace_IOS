import React, {useEffect, useState, useMemo} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

const CardConverter = ({PropertiesArray}) => {
  const baseCurrency = PropertiesArray?.currencyType || 'INR';

  const [currencyIndex, setCurrencyIndex] = useState(0);
  const [rates, setRates] = useState({});

  const currencies = useMemo(() => {
    const defaults = ['INR', 'USD'];
    return [baseCurrency, ...defaults.filter(c => c !== baseCurrency)];
  }, [baseCurrency]);

  useEffect(() => {
    getExchangeRates();
  }, []);

  const getExchangeRates = async () => {
    try {
      const res = await fetch(`https://open.er-api.com/v6/latest/INR`);
      const data = await res.json();
      setRates(data?.rates || {});
    } catch (error) {
      console.log('Error fetching rate:', error);
    }
  };

  const symbols = {
    INR: '₹',
    USD: '$',
    AED: 'د.إ',
    EUR: '€',
    LKR: 'රු'
  };

  const handlePress = () => {
    setCurrencyIndex(prev => (prev + 1) % currencies.length);
  };

  const currentCurrency = currencies[currencyIndex];
  const nextCurrency = currencies[(currencyIndex + 1) % currencies.length];

  const convert = (value, fromCurrency, toCurrency) => {
    if (!value) return value;

    const cleaned = value.toString().replace(/,/g, '');
    if (isNaN(cleaned)) return value;

    let number = parseFloat(cleaned);

    // Step 1: convert FROM currency → INR
    if (fromCurrency !== 'INR') {
      const toINRRate = 1 / rates[fromCurrency];
      number = number * toINRRate;
    }

    // Step 2: convert INR → target currency
    if (toCurrency !== 'INR') {
      number = number * rates[toCurrency];
    }

    return number.toLocaleString(undefined, {
      maximumFractionDigits: 2,
    });
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={{
        backgroundColor: '#021265',
        padding: 18,
        borderRadius: 10,
        marginTop: 15,
      }}
      activeOpacity={0.9}
    >
      {/* Toggle */}
      <Text style={{color: '#FFFFFF80', fontSize: 10, marginBottom: 5}}>
        Tap to convert to {nextCurrency}
      </Text>

      {/* TOTAL VALUE (INR → currentCurrency) */}
      <View>
        <Text style={{fontSize: 12, color: '#FFFFFFBF'}}>
          TOTAL PROPERTY VALUE
        </Text>
        <Text style={{fontSize: 20, color: '#FFF', fontWeight: '600'}}>
          {symbols[currentCurrency] || ''}
          {convert(PropertiesArray?.Price, 'INR', currentCurrency)}
        </Text>
      </View>

      <View
        style={{
          flexDirection: 'row',
          marginTop: 20,
          justifyContent: 'space-around',
        }}
      >
        {/* FRAC VALUE (INR → currentCurrency) */}
        {PropertiesArray?.name !== "ALTAIRA – VILLA" &&
        <View style={{borderLeftWidth: 2, borderLeftColor: '#FFF', paddingLeft: 7, flex: 1}}>
          <Text style={{fontSize: 12, color: '#FFFFFFBF'}}>
            FRAC VALUE
          </Text>
          <Text style={{fontSize: 14, color: '#FFF', fontWeight: '600'}}>
            {symbols[currentCurrency] || ''}
            {convert(PropertiesArray?.FC_Price, 'INR', currentCurrency)}
          </Text>
        </View>
        }

        {/* SPV VALUE (INR → currentCurrency) */}
        {PropertiesArray?.SPV && (
          <View style={{borderLeftWidth: 2, borderLeftColor: '#FFF', paddingLeft: 7, flex: 1}}>
            <Text style={{fontSize: 12, color: '#FFFFFFBF'}}>
              SPV VALUE
            </Text>
            <Text style={{fontSize: 14, color: '#FFF', fontWeight: '600'}}>
              {symbols[currentCurrency] || ''}
              {convert(PropertiesArray?.SPV, 'INR', currentCurrency)}
            </Text>
          </View>
        )}

        {/* BOOKING VALUE (currencyType → currentCurrency) */}
        <View style={{borderLeftWidth: 2, borderLeftColor: '#FFF', paddingLeft: 7, flex: 1}}>
          <Text style={{fontSize: 12, color: '#FFFFFFBF'}}>
            BOOKING VALUE
          </Text>
          <Text style={{fontSize: 14, color: '#FFF', fontWeight: '600'}}>
            {symbols[currentCurrency] || ''}
            {convert(PropertiesArray?.BookingAmt, baseCurrency, currentCurrency)}
          </Text>
        </View>

        
      </View>
    </TouchableOpacity>
  );
};

export default CardConverter;