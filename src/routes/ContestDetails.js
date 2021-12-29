import { Space, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { Descriptions } from 'antd';
import { useLocation, useParams } from 'react-router';

const ContestDetails = ({ contest, setContest }) => {
    //     const id = new URLSearchParams(useLocation()).getAll();
    //     const id = new URLSearchParams(useLocation().search).get('id');
    //     console.log(id);
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!contest) {
            setIsLoading(true);
            fetch('https://codeforces.com/api/contest.list')
                .then((res) => res.json())
                .then((res) => {
                    const temp = res.result.filter((elem) => elem.id === +id);
                    if (temp.length) setContest(temp[0]);
                })
                .catch((err) => console.log(err))
                .finally(() => setIsLoading(false));
        }
    }, []);
    return (
        <>
            {isLoading ? (
                <Space size='middle'>
                    <Spin size='large' />
                </Space>
            ) : contest ? (
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Descriptions title='Contest Info'>
                        <Descriptions.Item label='Id'>
                            {contest.id}
                        </Descriptions.Item>
                        <Descriptions.Item label='Name'>
                            {contest.name}
                        </Descriptions.Item>
                        <Descriptions.Item label='Type'>
                            {contest.type}
                        </Descriptions.Item>
                        <Descriptions.Item label='Duration'>
                            {`${contest.durationSeconds / 60} Minutes`}
                        </Descriptions.Item>
                        <Descriptions.Item label='Phase'>
                            {contest.phase}
                        </Descriptions.Item>
                    </Descriptions>
                </div>
            ) : (
                <div> No contest found! </div>
            )}
        </>
    );
};

export default ContestDetails;
