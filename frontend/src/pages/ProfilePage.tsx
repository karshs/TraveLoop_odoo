import React, { useEffect, useState, useRef } from "react";
import { getProfile, updateProfile, changePassword, uploadPhoto, deleteAccount } from "../api/user.api";
import { Eye, EyeOff, UploadCloud, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/ProfilePage.module.scss";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<any>({});
  
  const [passData, setPassData] = useState({ currentPassword: "", newPassword: "" });
  const [showPass, setShowPass] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await getProfile();
      setProfile(res.data);
      setFormData({
        firstName: res.data.firstName || "",
        lastName: res.data.lastName || "",
        phone: res.data.phone || "",
        age: res.data.age || "",
        language_pref: res.data.language_pref || "en"
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      if (payload.age) payload.age = Number(payload.age);
      await updateProfile(payload);
      alert("Profile updated successfully!");
      fetchProfile();
    } catch (err) {
      console.error(err);
      alert("Failed to update profile.");
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await changePassword(passData);
      alert("Password changed successfully!");
      setPassData({ currentPassword: "", newPassword: "" });
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to change password.");
    }
  };

  const handleUploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await uploadPhoto(file);
      alert("Photo uploaded!");
      fetchProfile();
    } catch (err) {
      console.error(err);
      alert("Upload failed.");
    }
  };

  const handleDeleteAccount = async () => {
    const confirm = window.prompt("Type DELETE to confirm account deletion:");
    if (confirm === "DELETE") {
      try {
        await deleteAccount();
        localStorage.removeItem("traveloop_token");
        localStorage.removeItem("token");
        navigate("/login");
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) return <div className={styles.loading}>Loading profile...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>My Profile</h1>
      </header>

      <div className={styles.profileSection}>
        <div className={styles.avatarWrapper} onClick={() => fileInputRef.current?.click()}>
          {profile.profile_photo_url ? (
            <img src={profile.profile_photo_url} alt="Profile" className={styles.avatarImg} />
          ) : (
            <div className={styles.avatarInitials}>
              {profile.firstName?.[0]}{profile.lastName?.[0]}
            </div>
          )}
          <div className={styles.uploadOverlay}>
            <UploadCloud size={24} />
          </div>
          <input
            type="file"
            ref={fileInputRef}
            className={styles.hiddenFile}
            onChange={handleUploadPhoto}
            accept="image/*"
          />
        </div>

        <form onSubmit={handleUpdateProfile} className={styles.profileForm}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>First Name</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Last Name</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Age</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Language Preference</label>
              <select
                value={formData.language_pref}
                onChange={(e) => setFormData({ ...formData, language_pref: e.target.value })}
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
            </div>
          </div>
          <button type="submit" className={styles.saveBtn}>Save Changes</button>
        </form>
      </div>

      {profile.password_hash && (
        <div className={styles.passwordSection}>
          <h2>Change Password</h2>
          <form onSubmit={handleChangePassword} className={styles.passwordForm}>
            <div className={styles.formGroup}>
              <label>Current Password</label>
              <div className={styles.passInputWrapper}>
                <input
                  type={showPass ? "text" : "password"}
                  value={passData.currentPassword}
                  onChange={(e) => setPassData({ ...passData, currentPassword: e.target.value })}
                  required
                />
                <button type="button" onClick={() => setShowPass(!showPass)}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className={styles.formGroup}>
              <label>New Password</label>
              <div className={styles.passInputWrapper}>
                <input
                  type={showPass ? "text" : "password"}
                  value={passData.newPassword}
                  onChange={(e) => setPassData({ ...passData, newPassword: e.target.value })}
                  required
                  minLength={8}
                />
              </div>
            </div>
            <button type="submit" className={styles.saveBtn}>Update Password</button>
          </form>
        </div>
      )}

      <div className={styles.dangerZone}>
        <div className={styles.dangerHeader}>
          <AlertTriangle size={24} color="#ff3b30" />
          <h2>Danger Zone</h2>
        </div>
        <p>Once you delete your account, there is no going back. Please be certain.</p>
        <button onClick={handleDeleteAccount} className={styles.deleteBtn}>
          Delete Account
        </button>
      </div>
    </div>
  );
}
