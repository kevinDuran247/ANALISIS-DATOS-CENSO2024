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
    RadarChart,
    Radar,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
} from 'recharts';
import { Button, FormControl, InputGroup, Container, Row, Col, Card, Dropdown } from 'react-bootstrap';
import { API_BASE_URL } from '../url';

const Poblacion = () => {
    const [poblaciones, setPoblaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [height, setHeight] = useState(400);
    const [graphType, setGraphType] = useState('Bar');
    const [filterCategory, setFilterCategory] = useState('Todos');

    const formatNumber = (num) => new Intl.NumberFormat('en-US').format(num);

    // Formateo de los datos de distribución a porcentaje
    const formatPercentage = (value) => {
        if (value !== null && value !== undefined) {
            return `${(value * 100).toFixed(2)}%`;  // Multiplicamos por 100 y damos formato con 2 decimales
        }
        return '-';
    };

    useEffect(() => {
        const fetchPoblaciones = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}poblacion`);
                const data = await response.json();

                if (data && data.data && Array.isArray(data.data)) {
                    const poblacionesTransformadas = data.data.slice(1).map((fila) => ({
                        departamento: fila[0],
                        hombres: fila[1] !== null ? parseInt(fila[1], 10) : null,
                        mujeres: fila[2] !== null ? parseInt(fila[2], 10) : null,
                        total: fila[3] !== null ? parseInt(fila[3], 10) : null,
                        distribucion: fila[4] !== null ? parseFloat(fila[4]) : null,
                    }));
                    setPoblaciones(poblacionesTransformadas);
                } else {
                    setError('Datos no disponibles o en formato incorrecto');
                }
            } catch (error) {
                console.error('Error al obtener los datos de población:', error);
                setError('Hubo un error al obtener los datos');
            } finally {
                setLoading(false);
            }
        };

        fetchPoblaciones();
    }, []);

    const filteredData = poblaciones.filter((data) => {
        if (filterCategory === 'Todos') {
            return data.departamento && data.departamento.toLowerCase().includes(search.toLowerCase());
        }
        return data[filterCategory] !== null && data[filterCategory] !== undefined;
    });

    const getColumns = () => {
        if (filterCategory === 'Todos') {
            return [
                { name: 'Departamento', selector: (row) => row.departamento, sortable: true },
                { name: 'Hombres', selector: (row) => formatNumber(row.hombres), sortable: true },
                { name: 'Mujeres', selector: (row) => formatNumber(row.mujeres), sortable: true },
                { name: 'Total', selector: (row) => formatNumber(row.total), sortable: true },
                { name: 'Distribución', selector: (row) => formatPercentage(row.distribucion), sortable: true },
            ];
        } else if (filterCategory === 'hombres') {
            return [
                { name: 'Departamento', selector: (row) => row.departamento, sortable: true },
                { name: 'Hombres', selector: (row) => formatNumber(row.hombres), sortable: true },
            ];
        } else if (filterCategory === 'mujeres') {
            return [
                { name: 'Departamento', selector: (row) => row.departamento, sortable: true },
                { name: 'Mujeres', selector: (row) => formatNumber(row.mujeres), sortable: true },
            ];
        } else if (filterCategory === 'total') {
            return [
                { name: 'Departamento', selector: (row) => row.departamento, sortable: true },
                { name: 'Total', selector: (row) => formatNumber(row.total), sortable: true },
            ];
        } else if (filterCategory === 'distribucion') {
            return [
                { name: 'Departamento', selector: (row) => row.departamento, sortable: true },
                { name: 'Distribución', selector: (row) => formatPercentage(row.distribucion), sortable: true },
            ];
        }
        return [];
    };

    const handleGraphTypeChange = (type) => {
        setGraphType(type);
    };

    return (
        <Container fluid className="py-4">
            <Row>
                {/* Tabla */}
                <Col lg={6}>
                    <Card className="shadow-sm">
                        <Card.Header className="bg-success text-white">
                            <h5 className="mb-0">Datos de Población</h5>
                        </Card.Header>
                        <Card.Body>
                            {/* Buscador y control de filas */}
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

                                <div className="ml-4">
                                    <FormControl
                                        as="select"
                                        value={rowsPerPage}
                                        onChange={(e) => setRowsPerPage(Number(e.target.value))}
                                    >
                                        <option value={5}>5</option>
                                        <option value={10}>10</option>
                                        <option value={20}>20</option>
                                    </FormControl>
                                </div>
                            </div>

                            {/* Filtro de categoría */}
                            <div className="mb-2">
                                <Dropdown>
                                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                                        Filtrar por
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={() => setFilterCategory('Todos')}>Todos</Dropdown.Item>
                                        <Dropdown.Item onClick={() => setFilterCategory('hombres')}>Hombres</Dropdown.Item>
                                        <Dropdown.Item onClick={() => setFilterCategory('mujeres')}>Mujeres</Dropdown.Item>
                                        <Dropdown.Item onClick={() => setFilterCategory('total')}>Total</Dropdown.Item>
                                        <Dropdown.Item onClick={() => setFilterCategory('distribucion')}>Distribución</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>

                            {/* Tabla de datos */}
                            <DataTable
                                columns={getColumns()}
                                data={filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)}
                                highlightOnHover
                            />

                            {/* Paginación */}
                            <div className="d-flex justify-content-between mt-2">
                                <Button
                                    variant="success"
                                    onClick={() => setCurrentPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    Anterior
                                </Button>
                                <span>
                                    Página {currentPage} de {Math.ceil(filteredData.length / rowsPerPage)}
                                </span>
                                <Button
                                    variant="success"
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                    disabled={currentPage === Math.ceil(filteredData.length / rowsPerPage)}
                                >
                                    Siguiente
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Gráfico */}
                <Col lg={6}>
                    <Card className="shadow-sm">
                        <Card.Header className="bg-success text-white">
                            <h5 className="mb-0">Gráfico</h5>
                        </Card.Header>
                        <Card.Body>
                            <div className="d-flex justify-content-between mb-2">
                                <Button variant="outline-success" onClick={() => handleGraphTypeChange('Bar')}>
                                    Barras
                                </Button>
                                <Button variant="outline-success" onClick={() => handleGraphTypeChange('Line')}>
                                    Líneas
                                </Button>
                                <Button variant="outline-success" onClick={() => handleGraphTypeChange('Area')}>
                                    Área
                                </Button>
                                <Button variant="outline-success" onClick={() => handleGraphTypeChange('Radar')}>
                                    Radar
                                </Button>
                            </div>

                            {/* Gráfico dinámico */}
                            {graphType === 'Bar' && (
                                <ResponsiveContainer width="100%" height={400}>
                                    <BarChart data={filteredData}>
                                        <XAxis dataKey="departamento" />
                                        <YAxis tickFormatter={(value) => formatNumber(value)} />
                                        <Tooltip formatter={(value) => formatNumber(value)} />
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <Legend />
                                        {filterCategory === 'Todos' ? (
                                            <>
                                                <Bar dataKey="hombres" fill="#28a745" />
                                                <Bar dataKey="mujeres" fill="#ff7300" />
                                                <Bar dataKey="total" fill="#0088fe" />
                                            </>
                                        ) : (
                                            <Bar dataKey={filterCategory} fill="#28a745" />
                                        )}
                                    </BarChart>
                                </ResponsiveContainer>
                            )}

                            {graphType === 'Line' && (
                                <ResponsiveContainer width="100%" height={400}>
                                    <LineChart data={filteredData}>
                                        <XAxis dataKey="departamento" />
                                        <YAxis tickFormatter={(value) => formatNumber(value)} />
                                        <Tooltip formatter={(value) => formatNumber(value)} />
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <Legend />
                                        {filterCategory === 'Todos' ? (
                                            <>
                                                <Line dataKey="hombres" stroke="#28a745" />
                                                <Line dataKey="mujeres" stroke="#ff7300" />
                                                <Line dataKey="total" stroke="#0088fe" />
                                            </>
                                        ) : (
                                            <Line dataKey={filterCategory} stroke="#28a745" />
                                        )}
                                    </LineChart>
                                </ResponsiveContainer>
                            )}

                            {graphType === 'Area' && (
                                <ResponsiveContainer width="100%" height={400}>
                                    <AreaChart data={filteredData}>
                                        <XAxis dataKey="departamento" />
                                        <YAxis tickFormatter={(value) => formatNumber(value)} />
                                        <Tooltip formatter={(value) => formatNumber(value)} />
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <Legend />
                                        {filterCategory === 'Todos' ? (
                                            <>
                                                <Area dataKey="hombres" fill="#28a745" />
                                                <Area dataKey="mujeres" fill="#ff7300" />
                                                <Area dataKey="total" fill="#0088fe" />
                                            </>
                                        ) : (
                                            <Area dataKey={filterCategory} fill="#28a745" />
                                        )}
                                    </AreaChart>
                                </ResponsiveContainer>
                            )}

                            {graphType === 'Radar' && (
                                <ResponsiveContainer width="100%" height={400}>
                                    <RadarChart data={filteredData}>
                                        <PolarGrid />
                                        <PolarAngleAxis dataKey="departamento" />
                                        <PolarRadiusAxis />
                                        {filterCategory === 'Todos' ? (
                                            <>
                                                <Radar name="Hombres" dataKey="hombres" stroke="#28a745" fill="#28a745" fillOpacity={0.6} />
                                                <Radar name="Mujeres" dataKey="mujeres" stroke="#ff7300" fill="#ff7300" fillOpacity={0.6} />
                                                <Radar name="Total" dataKey="total" stroke="#0088fe" fill="#0088fe" fillOpacity={0.6} />
                                            </>
                                        ) : (
                                            <Radar name={filterCategory} dataKey={filterCategory} stroke="#28a745" fill="#28a745" fillOpacity={0.6} />
                                        )}
                                    </RadarChart>
                                </ResponsiveContainer>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Poblacion;
