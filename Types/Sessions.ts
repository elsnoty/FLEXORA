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


export interface BookingSessions{
    id: string;
    start_time: string;
    end_time: string;
    status: string;
    rejection_reason: string;
    trainer_name: string;  
    trainer_avatar: string;
}