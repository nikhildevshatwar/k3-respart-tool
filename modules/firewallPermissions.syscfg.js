
exports = {
	displayName: "Permissions",
	config: [
		{
			name: "privid",
			displayName: "Priv ID",
			default: 0,
		},
		{
			name: "ns_user_rd",
			displayName: "Non Secure User Read",
			default: true,
		},
		{
			name: "ns_user_wr",
			displayName: "Non Secure User Write",
			default: true,
		},
		{
			name: "ns_user_ex",
			displayName: "Non Secure User Execute",
			default: true,
		},
		{
			name: "ns_supervisor_rd",
			displayName: "Non Secure Supervisor Read",
			default: true,
		},
		{
			name: "ns_supervisor_wr",
			displayName: "Non Secure Supervisor Write",
			default: true,
		},
		{
			name: "ns_supervisor_ex",
			displayName: "Non Secure Supervisor Execute",
			default: true,
		},
		{
			name: "s_user_rd",
			displayName: "Secure User Read",
			default: true,
		},
		{
			name: "s_user_wr",
			displayName: "Secure User Write",
			default: true,
		},
		{
			name: "s_user_ex",
			displayName: "Secure User Execute",
			default: true,
		},
		{
			name: "s_supervisor_rd",
			displayName: "Secure Supervisor Read",
			default: true,
		},
		{
			name: "s_supervisor_wr",
			displayName: "Secure Supervisor Write",
			default: true,
		},
		{
			name: "s_supervisor_ex",
			displayName: "Secure Supervisor Execute",
			default: true,
		}
	]
}
