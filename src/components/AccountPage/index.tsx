import Header from 'components/CommonComponents/Header';
import Footer from 'components/CommonComponents/Footer';
import './AccountPage.css';
import avatar1 from 'assets/avatar/Avatar1.svg';
import avatar2 from 'assets/avatar/Avatar2.svg';
import avatar3 from 'assets/avatar/Avatar3.svg';
import avatar4 from 'assets/avatar/Avatar4.svg';

import { BarChart } from '@mui/x-charts';

const AccountPage = () => {
  // # TODO: Fetch these from API
  const avatarIndex = 1; // # TODO: Replace with API response
  const avatars = [avatar1, avatar2, avatar3, avatar4];

  const username = 'User name';
  const employeeId = '123456789';
  const weeklySpending = [
    { day: '6/13', amount: 50 },
    { day: '6/14', amount: 100 },
    { day: '6/15', amount: 120 },
    { day: '6/16', amount: 150 },
    { day: '6/17', amount: 170 },
    { day: '6/18', amount: 130 },
    { day: '6/19', amount: 180 },
  ];
  const monthlyTotal = 700;
  const previousMonth = {
    month: '5月',
    amount: 3200,
    pay_status: true, // false:'未支付', true:'已支付'
  };

  return (
    <div>
      <Header />
      <div id='account-page'>
        <div className="account-content">
          <img src={avatars[avatarIndex]} className="avatar" alt="avatar" />
          <div className="username">{username}</div>
          <div className="employee-id">{employeeId}</div>
          <button className="logout-button">登出</button>

          <div className="chart-card">
            <div className="chart-title-day">6/19</div>
            <div className="chart-title-count">$180</div>
            <div className="mui-chart">
              <BarChart
                xAxis={[
                  {
                    scaleType: 'band',
                    dataKey: 'day',
                    tickLabelStyle: {
                      fill: '#EF7754',
                      fontSize: 12,
                      fontWeight: 700,
                      fontFamily: 'jf-openhuninn-2.1, Noto Sans TC, sans-serif',
                    },
                  },
                ]}
                yAxis={[{ id: 'amount', scaleType: 'linear' }]}
                series={[
                  {
                    dataKey: 'amount',
                    color: '#F4AFA3',
                    label: '消費金額',
                  },
                ]}
                dataset={weeklySpending}
                width={280}
                height={140}
                margin={{ top: 10, bottom: 0, left: -27, right: 15 }}
                sx={{
                  '.MuiChartsLegend-root': { display: 'none' },
                  '.MuiChartsTooltip-root': {
                    fontFamily: 'jf-openhuninn-2.1, Noto Sans TC, sans-serif',
                    fontSize: '0.8rem',
                    display: 'none',
                  },
                  '.MuiChartsAxis-left': {
                    display: 'none',
                  },
                  '.MuiChartsAxis-right': {
                    display: 'none',
                  },
                  '.MuiChartsAxis-line': {
                    stroke: 'transparent',
                  },
                  '.MuiChartsAxis-tick': {
                    stroke: 'transparent',
                  },
                }}
              />

            </div>
          </div>

          <div className="info-card">
            <div>本月累積金額</div>
            <div className="amount">${monthlyTotal}</div>
          </div>

        <div className={`info-card ${previousMonth.pay_status ? 'paid' : 'unpaid'}`}>
          <div>{previousMonth.month}賒帳金額</div>
          <div className="amount">
            ${previousMonth.amount}
            <span className={`status ${previousMonth.pay_status ? 'paid' : 'unpaid'}`}>
              {previousMonth.pay_status ? '已支付' : '未支付'}
            </span>
          </div>
        </div>

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AccountPage;
