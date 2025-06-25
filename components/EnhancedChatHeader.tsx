import { ArrowLeft, Crown } from 'lucide-react-native';
import React from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

interface ChatMatch {
  id: string;
  name: string;
  avatar: string;
  level: number;
  status: 'online' | 'offline' | 'in-game';
}

interface EnhancedChatHeaderProps {
  match: ChatMatch;
  onBack: () => void;
  onViewProfile: () => void;
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
}

const EnhancedChatHeader: React.FC<EnhancedChatHeaderProps> = ({
  match,
  onBack,
  onViewProfile,
  getStatusColor,
  getStatusText
}) => {
  return (
    <View style={styles.chatHeader}>
      <TouchableOpacity 
        onPress={onBack}
        style={styles.backButton}
      >
        <ArrowLeft size={24} color="#00F5FF" />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.chatHeaderInfo}
        onPress={onViewProfile}
        activeOpacity={0.7}
      >
        <Text style={styles.chatHeaderTitle}>{match.name}</Text>
        <View style={styles.chatHeaderBadges}>
          <View style={styles.chatLevelBadge}>
            <Crown size={12} color="#FFD700" />
            <Text style={styles.chatLevelText}>LVL {match.level}</Text>
          </View>
          <View style={[styles.chatStatusBadge, { backgroundColor: getStatusColor(match.status) }]}>
            <Text style={styles.chatStatusText}>{getStatusText(match.status)}</Text>
          </View>
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.chatHeaderRight}
        onPress={onViewProfile}
      >
        <Image source={{ uri: match.avatar }} style={styles.chatAvatar} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: screenWidth * 0.05,
    paddingVertical: screenWidth * 0.02,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    minHeight: screenWidth * 0.1,
  },
  backButton: {
    marginRight: screenWidth * 0.04,
    padding: 8,
  },
  chatHeaderInfo: {
    flex: 1,
  },
  chatHeaderTitle: {
    fontSize: Math.min(screenWidth * 0.05, 20),
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  chatHeaderBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  chatLevelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  chatLevelText: {
    fontSize: Math.min(screenWidth * 0.025, 10),
    fontFamily: 'Inter-Bold',
    color: '#FFD700',
    marginLeft: 4,
  },
  chatStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  chatStatusText: {
    fontSize: Math.min(screenWidth * 0.025, 10),
    fontFamily: 'Inter-Bold',
    color: '#0F0F23',
  },
  chatHeaderRight: {
    marginLeft: screenWidth * 0.04,
  },
  chatAvatar: {
    width: screenWidth * 0.1,
    height: screenWidth * 0.1,
    borderRadius: screenWidth * 0.05,
  },
});

export default EnhancedChatHeader; 