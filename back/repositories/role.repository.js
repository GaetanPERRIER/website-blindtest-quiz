const supabase = require('../config/db');

class RoleRepository {
    async findByName(roleName) {
        const { data, error } = await supabase
            .from('roles')
            .select('id, role')
            .eq('role', roleName)
            .single();

        if (error) throw error;
        return data;
    }

    async findById(roleId) {
        const { data, error } = await supabase
            .from('roles')
            .select('id, role')
            .eq('id', roleId)
            .single();

        if (error) throw error;
        return data;
    }
}

module.exports = new RoleRepository();
