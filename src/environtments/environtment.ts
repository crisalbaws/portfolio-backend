// export const environtment = {
//         type: "mssql",
//         username: "db_aa5dd6_casystemsryc_admin",
//         password: "*casPass123$@*",
//         host: "SQL9001.site4now.net",
//         port: 1433,
//         database: "db_aa5dd6_casystemsryc",
//         entities: [__dirname + '/**/*.entity{.ts,.js}'],
// }

export const environtment = {
        type: "mssql",
        username: "db_a9d7fa_ftm1970mobile_admin",
        password: "*CASystemsFTM1970$@*",
        host: "SQL5101.site4now.net",
        port: 1433,
        database: "db_a9d7fa_ftm1970mobile",
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        autoLoadEntities: true,
        synchronize: true,
        logging: true,
}

