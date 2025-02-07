import {Badge, BadgeProps, Table} from 'antd';
import {TableColumnsType} from 'antd';
import React, {useEffect, useState} from "react";
import {baseURL} from "../config.ts";

interface ContainerType {
    id: React.Key;
    ip: string;
    timestamp: string;
    latency_ms: number;
    state: string;
    status: string;
}

interface ReportType {
    id: number;
    pinger_name: React.Key;
    content: ContainerType[];
    created_at: string;
}

const dockerStatesToBadgeStatus = new Map<string, BadgeProps["status"]>([
    ["created", "default"],
    ["running", "success"],
    ["paused", "default"],
    ["restarting", "processing"],
    ["exited", "warning"],
    ["removing", "error"],
    ["dead", "error"],
]);

const pingColors = new Map<number, string>([
    [0, "green"],
    [100, "yellow"],
    [300, "orange"],
    [500, "red"],
]);

function getPingColor(ping: number): string {
    let color: string;
    const colors = Array.from(pingColors.keys()).sort();
    for (let i = 1; i < colors.length; i += 1) {
        if (colors[i-1] <= ping && ping < colors[i]) {
            color = pingColors.get(colors[i-1]) || 'gray';
            return color;
        }
    }
    color = pingColors.get(colors[colors.length-1]) || 'gray'
    return color;
}

const expandColumns: TableColumnsType<ContainerType> = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    {
        title: 'IP-адрес',
        dataIndex: 'ip',
        key: 'ip',
        align: 'center',
        render: (value) => <>{value == "" ? "-" : value}</>
    },
    {
        title: 'Состояние',
        dataIndex: 'state',
        key: 'state',
        render: (value) => <Badge status={dockerStatesToBadgeStatus.get(value) || "default"} text={value} />,
    },
    { title: 'Статус', dataIndex: 'status', key: 'status' },
    {
        title: 'Задержка, мс',
        dataIndex: 'latency_ms',
        key: 'latency_ms',
        align: 'center',
        render: (value) => value > 0 ? <Badge count={value} overflowCount={999} color={getPingColor(value)} /> : <Badge status="error" text="Неудача" />
    },
    {
        title: 'Дата опроса',
        dataIndex: 'timestamp',
        key: 'timestamp',
    }
]

const columns: TableColumnsType<ReportType> = [
    { title: 'Название', dataIndex: 'pinger_name', key: 'pinger_name' },
    {
        title: 'Контейнеров',
        dataIndex: 'content',
        key: 'content',
        align: 'center',
        render: (value) => <>{value.length}</>
    },
    { title: 'Последний отчёт', dataIndex: 'created_at', key: 'created_at' },
];

const expandedRowRender = (record: ReportType) => (
    <Table<ContainerType>
        columns={expandColumns}
        dataSource={record.content || []}
        pagination={false}
        size="small"
    />
);

const PingerTable = () => {
    const [data, setData] = useState<ReportType[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${baseURL}/reports`);
            if (!response.ok) {
                console.error(`Ошибка HTTP: ${response.status}`);
                return;
            }

            const result = await response.json();
            setData(result);
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();

        const intervalId = setInterval(() => {
            fetchData();
        }, 5000);

        return () => clearInterval(intervalId);
    }, []);

    return <Table<ReportType>
        columns={columns}
        expandable={{expandedRowRender, expandRowByClick: true}}
        dataSource={data}
        loading={loading}
        rowKey="pinger_name"
    />
};

export default PingerTable;