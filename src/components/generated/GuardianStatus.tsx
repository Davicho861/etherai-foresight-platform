import React from 'react';

type Guardian = {
	name: string;
	lastRun: string;
	status: 'Operacional' | 'Alerta';
};

const sample: Guardian[] = [
	{ name: 'Guardian A', lastRun: '2025-09-30 12:00:00', status: 'Operacional' },
	{ name: 'Guardian B', lastRun: '2025-09-30 12:05:00', status: 'Alerta' },
];

export const GuardianStatus: React.FC = () => {
	return (
		<div>
			<h3 className="text-lg font-medium">Estado de Guardianes</h3>
			<table className="w-full text-left border-collapse">
				<thead>
					<tr>
						<th className="p-2">Nombre</th>
						<th className="p-2">Última Ejecución</th>
						<th className="p-2">Estado</th>
					</tr>
				</thead>
				<tbody>
					{sample.map(g => (
						<tr key={g.name} className="border-t">
							<td className="p-2">{g.name}</td>
							<td className="p-2">{g.lastRun}</td>
							<td className="p-2">{g.status}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default GuardianStatus;