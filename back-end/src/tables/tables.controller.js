const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const {OCCUPIED,FREE,FINISHED,SEATED} = require("../constants");
const reservationService = require("../reservations/reservations.service");

const tableDefinition = {
    table_name: "C",
    capacity: 0,
};

function propertiesAreDefined(req,res,next){
    const table = req.body.data;
    if(!table){
        return next({status:400});
    }
    const keys = Object.keys(tableDefinition);
    keys.forEach(key =>{
        if(table[key] === undefined){
            return next({status:400, message: `${key} must be included`});
        }
    });
    keys.forEach(key =>{
        if (key === "table_name" && table[key].length <= tableDefinition.table_name.length){
            return next({status:400, message:"table name must be included"})
        } else if(key === "capacity" && table[key] === 0){
            return next({status:400, message:"table capacity must be greater than 0"});
        };
    })
    next();
}

async function updateTableValidation(req,res,next){
    const tableRequest = req.body.data;
    const {table_id} = req.params;
    const table = (await service.read(table_id))[0];

    if (Object.keys(tableRequest).length === 0){
        return next({status:400});
    }

    const reservation = await reservationService.readReservation(tableRequest.reservation_id);
    //if the selected table is occupied
    if (table.status === OCCUPIED){
        if(typeof tableRequest.reservation_id === "number"){
            return next({status:400, message:"table is occupied, select a different table"});
        }
        //if the table is free
    } else if (table.status === FREE || table.status === null){
        //and the request is attempting to set it as free, throw an error
        if (tableRequest.reservation_id === null){
            return next({status:400, message:"this table is already free"});
        } else if (tableRequest.reservation_id !== null && reservation.length === 0){
            return next({status:404,message:`Reservation ID ${tableRequest.reservation_id} not found`});
        }
    }
    res.locals.table = table;
    if (reservation.length !==0){
        res.locals.reservation = reservation[0];
    }

    next();
}

function checkCapacity(req,res,next){
    const {table} = res.locals;
    if (req.body.data.reservation_id !== null){
        const {reservation} = res.locals;
        if (reservation.people > table.capacity){
            return next({status:400, message:"This party has too many people for this table. Select a different table."});
        }
    }
    next();
}

function reservationSeatedAlready(req,res,next){
    const {table} = res.locals;
    if(req.body.data.reservation_id !== null){
        const {reservation} = res.locals;
        if(reservation.status === SEATED){
            return next({status:400, message:"This party is already seated at a different table, please select a different reservation."});
        }
    }
    next();
}

async function create(req,res){
    const newTable = await service.create(req.body.data);
    res.status(201).json({data:newTable});
}

async function list(req,res){
    const data = await service.list();
    res.json({data});
}

async function readTable(req,res,next){
    const data = await service.read(req.params.table_id);
    if(data.length === 0){
        return next({status:404, message:`Table ID ${req.params.table_id} not Found, please select a different table`});
    }
    res.json({data});
}

async function updateTable(req,res,next){
    const {reservation_id} = req.body.data;
    const {table} = res.locals;

    let reservation;
    if (reservation_id === null){
        reservation = (await reservationService.readReservation(table.reservation_id))[0];
        table.status = FREE;
        reservation.status = FINISHED;
        table.reservation_id = null
    } else {
        reservation = res.locals.reservation;
        table.status = OCCUPIED;
        reservation.status = SEATED;
        table.reservation_id = reservation.reservation_id;
    }

    const updatedTable = (await service.update(table))[0];
    const updatedReservation = await reservationService.update(reservation);

    res.status(200).json({updatedTable})
}

module.exports = {
    list: asyncErrorBoundary(list),
    create: [propertiesAreDefined, asyncErrorBoundary(create)],
    read: asyncErrorBoundary(readTable),
    update: [
        asyncErrorBoundary(updateTableValidation),
        checkCapacity,
        reservationSeatedAlready,
        asyncErrorBoundary(updateTable)
    ],
}