import React, { useEffect, useState } from "react";
import { getStats, getTopCities, getTopActivities, getAdminUsers, getAdminTrips } from "../api/admin.api";
// @ts-ignore
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Users, Plane, Globe, MapPin, Activity, UserPlus, FilePlus } from "lucide-react";
import styles from "../styles/AdminDashboardPage.module.scss";

export default function AdminDashboardPage() {
  const { user } = useAuth() as any;
  const navigate = useNavigate();

  const [stats, setStats] = useState<any>(null);
  const [topCities, setTopCities] = useState<any[]>([]);
  const [topActivities, setTopActivities] = useState<any[]>([]);
  const [usersData, setUsersData] = useState<any>(null);
  const [tripsData, setTripsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== "ADMIN") {
      navigate("/dashboard");
      return;
    }

    const fetchData = async () => {
      try {
        const [statsRes, citiesRes, actsRes, usersRes, tripsRes] = await Promise.all([
          getStats(),
          getTopCities(),
          getTopActivities(),
          getAdminUsers(),
          getAdminTrips()
        ]);
        setStats(statsRes.data);
        setTopCities(citiesRes.data);
        setTopActivities(actsRes.data);
        setUsersData(usersRes.data);
        setTripsData(tripsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, navigate]);

  if (loading) return <div className={styles.loading}>Loading admin dashboard...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Admin Dashboard</h1>
      </header>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <Users className={styles.iconUsers} />
          <div className={styles.statInfo}>
            <span>Total Users</span>
            <h2>{stats?.totalUsers}</h2>
          </div>
        </div>
        <div className={styles.statCard}>
          <Plane className={styles.iconTrips} />
          <div className={styles.statInfo}>
            <span>Total Trips</span>
            <h2>{stats?.totalTrips}</h2>
          </div>
        </div>
        <div className={styles.statCard}>
          <Globe className={styles.iconPublic} />
          <div className={styles.statInfo}>
            <span>Public Trips</span>
            <h2>{stats?.publicTrips}</h2>
          </div>
        </div>
        <div className={styles.statCard}>
          <MapPin className={styles.iconStops} />
          <div className={styles.statInfo}>
            <span>Total Stops</span>
            <h2>{stats?.totalStops}</h2>
          </div>
        </div>
        <div className={styles.statCard}>
          <Activity className={styles.iconActs} />
          <div className={styles.statInfo}>
            <span>Activities Added</span>
            <h2>{stats?.totalActivitiesAdded}</h2>
          </div>
        </div>
        <div className={styles.statCard}>
          <UserPlus className={styles.iconNewUsers} />
          <div className={styles.statInfo}>
            <span>New Users (7d)</span>
            <h2>{stats?.newUsersThisWeek}</h2>
          </div>
        </div>
        <div className={styles.statCard}>
          <FilePlus className={styles.iconNewTrips} />
          <div className={styles.statInfo}>
            <span>New Trips (7d)</span>
            <h2>{stats?.newTripsThisWeek}</h2>
          </div>
        </div>
      </div>

      <div className={styles.twoCol}>
        <div className={styles.tableCard}>
          <h3>Top Cities</h3>
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>City</th>
                <th>Trips</th>
              </tr>
            </thead>
            <tbody>
              {topCities.map((city, i) => (
                <tr key={city.city_id}>
                  <td>{i + 1}</td>
                  <td>{city.name}, {city.country}</td>
                  <td>{city.trip_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.tableCard}>
          <h3>Top Activities</h3>
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Activity</th>
                <th>Category</th>
                <th>Added</th>
              </tr>
            </thead>
            <tbody>
              {topActivities.map((act, i) => (
                <tr key={act.activity_id}>
                  <td>{i + 1}</td>
                  <td>{act.name}</td>
                  <td><span className={styles.categoryBadge}>{act.category}</span></td>
                  <td>{act.added_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={styles.tableCard}>
        <h3>Recent Users</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Verified</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {usersData?.users.map((u: any) => (
              <tr key={u.id}>
                <td>{u.firstName} {u.lastName}</td>
                <td>{u.email}</td>
                <td>
                  <span className={`${styles.roleBadge} ${styles[u.role]}`}>{u.role}</span>
                </td>
                <td>{u.is_verified ? "Yes" : "No"}</td>
                <td>{new Date(u.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className={styles.pagination}>
          <span>Page {usersData?.page} of {usersData?.totalPages}</span>
        </div>
      </div>

      <div className={styles.tableCard}>
        <h3>Recent Trips</h3>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Owner</th>
              <th>Status</th>
              <th>Stops</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {tripsData?.trips.map((t: any) => (
              <tr key={t.id}>
                <td>{t.title}</td>
                <td>{t.user.firstName} {t.user.lastName}</td>
                <td><span className={styles.statusBadge}>{t.status}</span></td>
                <td>{t._count.stops}</td>
                <td>{new Date(t.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className={styles.pagination}>
          <span>Page {tripsData?.page} of {tripsData?.totalPages}</span>
        </div>
      </div>
    </div>
  );
}
