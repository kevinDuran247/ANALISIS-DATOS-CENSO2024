import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
    Legend,
    LineChart,
    Line,
    AreaChart,
    Area,
} from 'recharts';
import { Button, FormControl, InputGroup, Container, Row, Col, Card, Dropdown } from 'react-bootstrap';
import { API_BASE_URL } from '../url';

const Discapacidades1 = () => {
    const [discapacidadesData, setDiscapacidadesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [height, setHeight] = useState(400);
    const [graphType, setGraphType] = useState('Bar');
    const [filterCategory, setFilterCategory] = useState('Todos');

    const formatNumber = (num) => new Intl.NumberFormat('en-US').format(num);

    // Función de formato de porcentaje
    const formatPercentage = (num) => (num !== null ? `${(num * 100).toFixed(2)}%` : '0%');

    useEffect(() => {
        const fetchDiscapacidadesData = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}discapacidades`);
                const data = await response.json();

                if (data && data.data && Array.isArray(data.data)) {
                    const discapacidadesTransformados = data.data.slice(1).map((fila) => ({
                        departamento: fila[0],
                        hombres: fila[1] !== null ? parseInt(fila[1], 10) : null,
                        mujeres: fila[2] !== null ? parseInt(fila[2], 10) : null,
                        total: fila[3] !== null ? parseInt(fila[3], 10) : null,

                    }));
                    setDiscapacidadesData(discapacidadesTransformados);
                } else {
                    setError('Datos no disponibles o en formato incorrecto');
                }
            } catch (error) {
                console.error('Error al obtener los datos de Discapacidades:', error);
                setError('Hubo un error al obtener los datos');
            } finally {
                setLoading(false);
            }
        };

        fetchDiscapacidadesData();
    }, []);

    const filteredData = discapacidadesData
        .filter((data) => {
            if (filterCategory === 'Todos') {
                return data.departamento && data.departamento.toLowerCase().includes(search.toLowerCase());
            }
            return data[filterCategory] !== null && data[filterCategory] !== undefined;
        })
        .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
    const getColumns = () => {
        if (filterCategory === 'Todos') {
            return [
                { name: 'Departamento', selector: (row) => row.departamento, sortable: true },
                { name: 'Hombres', selector: (row) => formatNumber(row.hombres), sortable: true },
                { name: 'Mujeres', selector: (row) => formatNumber(row.mujeres), sortable: true },
                { name: 'Total', selector: (row) => formatNumber(row.total), sortable: true },
            ];
        } else {
            return [
                { name: 'Departamento', selector: (row) => row.departamento, sortable: true },
                { name: filterCategory, selector: (row) => formatNumber(row[filterCategory]), sortable: true },
            ];
        }
    };

    const totalPages = Math.ceil(discapacidadesData.length / rowsPerPage);

    const handlePageChange = (page) => setCurrentPage(page);

    return (
        <Container fluid className="py-4">
            <Row>
                <Col lg={6}>
                    <Card className="shadow-sm">
                        <Card.Header className="bg-success text-white">
                            <h5 className="mb-0">Datos de Discapacidades</h5>
                        </Card.Header>
                        <Card.Body>
                            <div className="d-flex justify-content-between mb-2">
                                <InputGroup>
                                    <FormControl
                                        placeholder="Buscar por departamento"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                    <Button
                                        variant="outline-secondary"
                                        onClick={() => setSearch('')}
                                        className="bg-success text-white"
                                    >
                                        Limpiar
                                    </Button>
                                </InputGroup>
                            </div>

                            {/* Dropdown de filtrado */}
                            <div className="mb-2">
                                <Dropdown>
                                    <Dropdown.Toggle variant="success" id="dropdown-custom-components">
                                        Filtrar por: {filterCategory}
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={() => setFilterCategory('Todos')}>Todos</Dropdown.Item>
                                        <Dropdown.Item onClick={() => setFilterCategory('hombres')}>Hombres</Dropdown.Item>
                                        <Dropdown.Item onClick={() => setFilterCategory('mujeres')}>Mujeres</Dropdown.Item>
                                        <Dropdown.Item onClick={() => setFilterCategory('total')}>Total</Dropdown.Item>
                                        <Dropdown.Item onClick={() => setFilterCategory('distribucionTotal')}>Distribución Total</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>

                            <DataTable
                                columns={getColumns()}
                                data={filteredData}
                                highlightOnHover
                                className="table-success"
                            />

                            <div className="d-flex justify-content-between mt-3">
                                <Button
                                    disabled={currentPage === 1}
                                    onClick={() => handlePageChange(currentPage - 1)}
                                >
                                    Anterior
                                </Button>
                                <span>
                                    Página {currentPage} de {totalPages}
                                </span>
                                <Button
                                    disabled={currentPage === totalPages}
                                    onClick={() => handlePageChange(currentPage + 1)}
                                >
                                    Siguiente
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={6}>
                    <Card className="shadow-sm">
                        <Card.Header className="bg-success text-white">
                            <h5 className="mb-0">Gráfico</h5>
                        </Card.Header>
                        <Card.Body>
                            <div className="mb-2">
                                <Button
                                    variant="success"
                                    onClick={() => setGraphType('Bar')}
                                    className="mr-2"
                                >
                                    Barra
                                </Button>
                                <Button
                                    variant="success"
                                    onClick={() => setGraphType('Line')}
                                    className="mr-2"
                                >
                                    Línea
                                </Button>
                                <Button
                                    variant="success"
                                    onClick={() => setGraphType('Area')}
                                    className="mr-2"
                                >
                                    Área
                                </Button>
                                <Button
                                    variant="success"
                                    onClick={() => setGraphType('Pyramid')}
                                    className="mr-2"
                                >
                                    Pirámide
                                </Button>
                            </div>
                            {graphType === 'Bar' && (
                                <ResponsiveContainer width="100%" height={height}>
                                    <BarChart data={filteredData}>
                                        <XAxis dataKey="departamento" />
                                        <YAxis tickFormatter={(value) => formatNumber(value)} />
                                        <Tooltip formatter={(value) => formatNumber(value)} />
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <Legend />
                                        <Bar dataKey="hombres" fill="#28a745" name="Hombres" />
                                        <Bar dataKey="mujeres" fill="#007bff" name="Mujeres" />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                            {graphType === 'Line' && (
                                <ResponsiveContainer width="100%" height={height}>
                                    <LineChart data={filteredData}>
                                        <XAxis dataKey="departamento" />
                                        <YAxis tickFormatter={(value) => formatNumber(value)} />
                                        <Tooltip formatter={(value) => formatNumber(value)} />
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <Legend />
                                        <Line type="monotone" dataKey="hombres" stroke="#28a745" name="Hombres" />
                                        <Line type="monotone" dataKey="mujeres" stroke="#007bff" name="Mujeres" />
                                    </LineChart>
                                </ResponsiveContainer>
                            )}
                            {graphType === 'Area' && (
                                <ResponsiveContainer width="100%" height={height}>
                                    <AreaChart data={filteredData}>
                                        <XAxis dataKey="departamento" />
                                        <YAxis tickFormatter={(value) => formatNumber(value)} />
                                        <Tooltip formatter={(value) => formatNumber(value)} />
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <Legend />
                                        <Area type="monotone" dataKey="hombres" fill="#28a745" stroke="#28a745" name="Hombres" />
                                        <Area type="monotone" dataKey="mujeres" fill="#007bff" stroke="#007bff" name="Mujeres" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            )}
                            {graphType === 'Pyramid' && (
                                <ResponsiveContainer width="100%" height={height}>
                                    <BarChart data={filteredData} layout="vertical">
                                        <XAxis type="number" />
                                        <YAxis dataKey="departamento" />
                                        <Tooltip formatter={(value) => formatNumber(value)} />
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <Legend />
                                        <Bar dataKey="hombres" fill="#28a745" name="Hombres" />
                                        <Bar dataKey="mujeres" fill="#007bff" name="Mujeres" />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Discapacidades1;

