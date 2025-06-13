import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  useWindowDimensions,
  Platform,
  Animated,
  Image
} from 'react-native';
import { router } from 'expo-router';

const CATEGORIES = [
  {
    id: '1',
    name: "Engineer's",
    route: 'civil-engineer',
    image: 'https://images.pexels.com/photos/8005376/pexels-photo-8005376.jpeg?auto=compress&cs=tinysrgb&w=400',
    color: '#3B82F6',
  },
  {
    id: '2',
    name: 'Plumbers Registration',
    route: 'plumber',
    image: 'https://images.pexels.com/photos/8961127/pexels-photo-8961127.jpeg?auto=compress&cs=tinysrgb&w=400',
    color: '#14B8A6',
  },
  {
    id: '3',
    name: 'Granite & Tiles Laying',
    route: 'marble-provider',
    image: 'https://images.pexels.com/photos/7218663/pexels-photo-7218663.jpeg?auto=compress&cs=tinysrgb&w=400',
    color: '#F59E0B',
  },
  {
    id: '4',
    name: 'Painting and Cleaning',
    route: 'painter',
    image: 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=400',
    color: '#8B5CF6',
  },
  {
    id: '5',
    name: 'Contractor and Building',
    route: 'laborer',
    image: 'https://images.pexels.com/photos/8961315/pexels-photo-8961315.jpeg?auto=compress&cs=tinysrgb&w=400',
    color: '#EC4899',
  },
  {
    id: '6',
    name: "Labor's",
    route: 'laborer',
    image: 'https://images.pexels.com/photos/4239091/pexels-photo-4239091.jpeg?auto=compress&cs=tinysrgb&w=400',
    color: '#EF4444',
  },
  {
    id: '7',
    name: 'Mason/Mistri',
    route: 'laborer',
    image: 'https://images.pexels.com/photos/8005397/pexels-photo-8005397.jpeg?auto=compress&cs=tinysrgb&w=400',
    color: '#10B981',
  },
  {
    id: '8',
    name: "Interiors Designer's",
    route: 'painter',
    image: 'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=400',
    color: '#6366F1',
  },
  {
    id: '9',
    name: 'Stainless Steel M.S',
    route: 'electrician',
    image: 'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=400',
    color: '#F97316',
  }
];

export default function ServiceCategoryGrid() {
  const { width } = useWindowDimensions();
  const numColumns = 3;
  
  // Calculate item width based on container width and number of columns
  const itemWidth = (width - 40 - (numColumns - 1) * 12) / numColumns;
  
  const fadeAnim = React.useRef(
    CATEGORIES.map((_, i) => new Animated.Value(0))
  ).current;
  
  React.useEffect(() => {
    const animations = CATEGORIES.map((_, i) => {
      return Animated.timing(fadeAnim[i], {
        toValue: 1,
        duration: 400,
        delay: i * 50,
        useNativeDriver: true,
      });
    });
    
    Animated.stagger(50, animations).start();
  }, []);

  const handleCategoryPress = (category: any) => {
    router.push(`/services/${category.route}`);
  };

  const renderItem = ({ item, index }) => {
    return (
      <Animated.View
        style={{
          opacity: fadeAnim[index],
          transform: [{ 
            translateY: fadeAnim[index].interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0]
            })
          }]
        }}
      >
        <TouchableOpacity
          style={[
            styles.categoryItem,
            { width: itemWidth }
          ]}
          activeOpacity={0.8}
          onPress={() => handleCategoryPress(item)}
        >
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: item.image }} 
              style={styles.categoryImage}
              resizeMode="cover"
            />
            <View style={styles.overlay} />
          </View>
          <View style={styles.categoryContent}>
            <Text style={styles.categoryName} numberOfLines={2}>
              {item.name}
            </Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={CATEGORIES}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        columnWrapperStyle={styles.columnWrapper}
        scrollEnabled={false}
        contentContainerStyle={styles.gridContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gridContainer: {
    paddingBottom: 0,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  categoryItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    height: 120,
    ...Platform.select({
      ios: {
        shadowColor: '#CBD5E1',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
      },
    }),
  },
  imageContainer: {
    flex: 1,
    position: 'relative',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  categoryContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 14,
  },
});