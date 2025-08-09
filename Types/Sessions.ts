export interface SessionView {
id: string;
start_time: string;
end_time: string;
status: 'pending' | 'accepted' | 'rejected';
trainee_id: string;
trainee_name?: string; 
trainee_avatar?: string;
rejection_reason?: string;
};


export interface BookingSessionsTrainee{
    id: string;
    start_time: string;
    end_time: string;
    status: string;
    rejection_reason: string;
    trainer_name: string;  
    trainer_avatar: string;
    payment_status: string;
    trainer_id:string;
}