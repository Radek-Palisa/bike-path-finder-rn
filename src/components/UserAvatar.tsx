import { getAuth } from 'firebase/auth';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

type Props = {
  onPress?: () => void;
};

export default function UserAvatar({ onPress }: Props) {
  const user = getAuth().currentUser;

  if (!user) return null;

  const photoUrl = user.photoURL;
  const firstLetter = user.displayName?.[0];

  const Avatar = photoUrl ? (
    <Image
      style={styles.image}
      source={{
        uri: photoUrl,
      }}
    />
  ) : (
    <Text style={styles.text}>{firstLetter}</Text>
  );

  if (onPress) {
    return (
      <TouchableOpacity style={styles.container} onPress={onPress}>
        {Avatar}
      </TouchableOpacity>
    );
  }

  return <View style={styles.container}>{Avatar}</View>;
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
    height: 30,
    backgroundColor: 'lightgray',
    borderRadius: 30,
  },
  image: {
    width: 30,
    height: 30,
    borderRadius: 30,
  },
  text: {
    color: '#303030',
  },
});
