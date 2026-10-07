import React from 'react';
import { ActivityIndicator, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

/** "Are you sure?" dialog for Delete Account (Home side menu and Profile tab). */
export default function DeleteAccountModal({ visible, onCancel, onConfirm, deleting }) {
  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onCancel}>
      <View style={styles.background}>
        <View style={styles.container}>
          <Text style={styles.title}>Delete Account</Text>
          <Text style={styles.subtitle}>Are you sure you want to delete this account?</Text>
          <View style={styles.buttons}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onCancel} disabled={deleting}>
              <Text style={[styles.buttonText, { color: '#0E2038' }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={onConfirm} disabled={deleting}>
              {deleting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Delete</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
    color: '#000',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 14,
    color: '#000000',
    marginTop: 10,
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 20,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  button: {
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 15,
    width: '40%',
    marginHorizontal: 3,
    alignItems: 'center',
  },
  cancelButton: {
    borderColor: '#0E2038',
    borderWidth: 1,
  },
  deleteButton: {
    backgroundColor: '#0E2038',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
