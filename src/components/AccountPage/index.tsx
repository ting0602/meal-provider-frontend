import Header from 'components/CommonComponents/Header';
import Footer from 'components/CommonComponents/Footer';
import './AccountPage.css';
import avatar1 from 'assets/avatar/Avatar1.svg';
import avatar2 from 'assets/avatar/Avatar2.svg';
import avatar3 from 'assets/avatar/Avatar3.svg';
import avatar4 from 'assets/avatar/Avatar4.svg';
import { useEffect, useState } from 'react';
import { BarChart } from '@mui/x-charts';
import { useAuth } from 'provider/AuthProvider';
import { useGetUserById, useUpdateUser, useUserWeeklyPrice, useUserMonthlyTotal } from 'hooks/useUser';
import { useNavigate } from 'react-router-dom';

const avatars = [avatar1, avatar2, avatar3, avatar4];

const AccountPage = () => {
  const { userId, logout } = useAuth();
  const navigate = useNavigate();
  const { data: user, isLoading, isError } = useGetUserById(userId!);
  const { mutate: updateUser } = useUpdateUser(userId!);

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const dateStr = today.toISOString().split('T')[0];

  const { data: weeklySpendingData = [] } = useUserWeeklyPrice(userId!, dateStr);
  const { data: currentMonthTotal = 0 } = useUserMonthlyTotal(userId!, year, month);

  const getAdjustedYearMonth = (year: number, month: number) => {
    if (month === 0) return { year: year - 1, month: 12 };
    return { year, month };
  };

  const { year: lastMonthYear, month: lastMonthNum } = getAdjustedYearMonth(year, month - 1);
  const { data: lastMonthTotal = 0 } = useUserMonthlyTotal(userId!, lastMonthYear, lastMonthNum);

  const [selectedFactoryIndex, setSelectedFactoryIndex] = useState<number | null>(null);

  const handleLogout = () => {
    logout();             // 清除 userId/token 等
    navigate('/');   // 導回登入頁
  };
  useEffect(() => {
    if (user) {
      setSelectedFactoryIndex(user.location);
    }
  }, [user]);

  useEffect(() => {
    return () => {
      if (
        user &&
        selectedFactoryIndex !== null &&
        selectedFactoryIndex !== user.location
      ) {
        updateUser({ location: selectedFactoryIndex });
      }
    };
  }, [selectedFactoryIndex, user, updateUser]);

  if (isLoading) return <div>載入中...</div>;
  if (isError || !user) return <div>無法載入使用者資料</div>;

  const avatarIndex = user.head_sticker ?? 0;
  const employeeId = user.employeeId ?? '';
  const pay_status = 'unpaid';


  const weeklySpending = weeklySpendingData.map((amount, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (6 - i));
    const label = `${d.getMonth() + 1}/${d.getDate()}`;
    return { day: label, amount };
  });


  // const currentLocation = factories[ßselectedFactoryIndex ?? 0] ?? '';

  // const weeklySpending = [
  //   { day: '6/13', amount: 50 },
  //   { day: '6/14', amount: 100 },
  //   { day: '6/15', amount: 120 },
  //   { day: '6/16', amount: 150 },
  //   { day: '6/17', amount: 170 },
  //   { day: '6/18', amount: 130 },
  //   { day: '6/19', amount: 180 },
  // ];
  // const monthlyTotal = 700;
  // const previousMonth = {
  //   month: '5月',
  //   amount: 3200,
  //   pay_status: true,
  // };

  return (
    <div>
    <Header
      defaultFactoryIndex={selectedFactoryIndex ?? 0}
      onSelectFactory={(_, index) => setSelectedFactoryIndex(index)}
    />
      <div id='account-page'>
        <div className="user-account-content">
          <img src={avatars[avatarIndex]} className="avatar" alt="avatar" />
          {/* <div className="username">{user.account}</div> */}
          <div className="employee-id">{employeeId}</div>
          <button className="user-logout-button" onClick={handleLogout}>登出</button>

          <div className="chart-card">
            <div className="chart-title-day">{weeklySpending.at(-1)?.day}</div>
            <div className="chart-title-count">${weeklySpending.at(-1)?.amount}</div>
            <div className="mui-chart">
              <BarChart
                xAxis={[{
                  scaleType: 'band',
                  dataKey: 'day',
                  tickLabelStyle: {
                    fill: '#EF7754',
                    fontSize: 12,
                    fontWeight: 700,
                    fontFamily: 'jf-openhuninn-2.1, Noto Sans TC, sans-serif',
                  },
                }]}
                yAxis={[{ id: 'amount', scaleType: 'linear' }]}
                series={[{ dataKey: 'amount', color: '#F4AFA3', label: '消費金額' }]}
                slotProps={{ tooltip: { trigger: 'item' } }}
                dataset={weeklySpending}
                width={280}
                height={140}
                margin={{ top: 10, bottom: 0, left: -27, right: 15 }}
                sx={{
                  '.MuiChartsLegend-root': { display: 'none' },
                  '.MuiChartsTooltip-root': {
                    fontFamily: 'jf-openhuninn-2.1, Noto Sans TC, sans-serif',
                    fontSize: '0.8rem',
                    display: 'block',
                  },
                  '.MuiChartsAxis-left, .MuiChartsAxis-right': { display: 'none' },
                  '.MuiChartsAxis-bottom .MuiChartsAxis-line, .MuiChartsAxis-bottom .MuiChartsAxis-tick': {
                    stroke: 'transparent',
                  },
                }}
              />
            </div>
          </div>

          <div className="info-card">
            <div>本月累積金額</div>
            <div className="amount">${currentMonthTotal}</div>
          </div>

          <div className={`info-card ${pay_status ? 'paid' : 'unpaid'}`}>
            <div>{lastMonthNum}月賒帳金額</div>
            <div className="amount">
              ${lastMonthTotal}
              <span className={`status ${pay_status ? 'paid' : 'unpaid'}`}>
                {pay_status ? '已支付' : '未支付'}
              </span>
            </div>
          </div>
        </div>
      </div>
      <Footer avatarIndex={user.head_sticker} />
    </div>
  );
};

export default AccountPage;
